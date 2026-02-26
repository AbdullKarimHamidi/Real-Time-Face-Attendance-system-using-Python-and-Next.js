
import asyncio
import threading
from datetime import datetime, timedelta

from telegram import (
    Bot,
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
)
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
)
from telegram.error import BadRequest

BOT_TOKEN = "8502606814:AAHJwITJ28_yM1SZchrUV_laLwuRGHAZP6A"
TIMEOUT_SECONDS = 300

bot: Bot | None = None
event_loop: asyncio.AbstractEventLoop | None = None
message_queue: asyncio.Queue | None = None

# ================= MEMORY STORAGE =================
attendance_requests: dict[int, dict] = {}
users_sent_id: set[int] = set()
request_lock = threading.Lock()


def get_keyboard():
    return InlineKeyboardMarkup(
        [[
            InlineKeyboardButton("🟢 Entrance", callback_data="entrance"),
            InlineKeyboardButton("🔴 Exit", callback_data="exit"),
        ]]
    )

# ================= TELEGRAM BOT =================
def start_telegram_bot():
    async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
        user = update.effective_user
        telegram_id = user.id
        # only send ID 
        if telegram_id not in users_sent_id:
            await update.message.reply_text(
                f"👤 Hello {user.first_name}\n"
                f"Your Telegram ID is:\n\n"
                f"`{telegram_id}`",
                parse_mode="Markdown"
            )
            users_sent_id.add(telegram_id)

        await update.message.reply_text(
            "👇 Choose an action:",
            reply_markup=get_keyboard()
        )

    async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        await query.answer()

        telegram_id = query.from_user.id
        action = query.data

        with request_lock:
            attendance_requests[telegram_id] = {
                "action": action,
                "time": datetime.now()
            }

        text = (
            f"✅ *{action.upper()} REQUESTED*\n\n"
            f"📸 Please stand in front of the camera\n"
            f"⏱ Valid for 5 minutes"
        )
        try:
            await query.edit_message_text(
                text=text,
                parse_mode="Markdown",
                reply_markup=get_keyboard()
            )
        except BadRequest as e:
            if "Message is not modified" not in str(e):
                raise e

    def run_bot():
        global bot, event_loop, message_queue

        event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(event_loop)

        bot = Bot(BOT_TOKEN)
        app = ApplicationBuilder().token(BOT_TOKEN).build()

        app.add_handler(CommandHandler("start", start))
        app.add_handler(CallbackQueryHandler(button_handler))

        message_queue = asyncio.Queue()

        async def queue_worker():
            while True:
                user_id, text = await message_queue.get()
                try:
                    await bot.send_message(chat_id=user_id, text=text)
                except Exception as e:
                    print("Telegram send error:", e)

        event_loop.create_task(queue_worker())
        event_loop.run_until_complete(app.run_polling())

    threading.Thread(target=run_bot, daemon=True).start()

# ================= SEND MESSAGE (EXTERNAL USE) =================
def send_message(user_id: int, message: str):
    if not event_loop or not message_queue:
        print("Telegram bot not ready")
        return

    asyncio.run_coroutine_threadsafe(
        message_queue.put((user_id, message)),
        event_loop
    )

# ================= CHECK ATTENDANCE (CAMERA SIDE) =================
def check_attendance_request(telegram_id: int) -> str | None:
    with request_lock:
        req = attendance_requests.get(telegram_id)
        if not req:
            return None

        if datetime.now() - req["time"] > timedelta(seconds=TIMEOUT_SECONDS):
            del attendance_requests[telegram_id]
            return None

        action = req["action"]
        del attendance_requests[telegram_id]
        return action