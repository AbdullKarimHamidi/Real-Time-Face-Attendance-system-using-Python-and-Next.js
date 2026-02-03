import cv2
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

# Camera mapping
cameras = {
    "herat": 0,
    "kabul": 1,
    "mazar": 2
}

caps = {}

# Initialize cameras
for name, index in cameras.items():
    cap = cv2.VideoCapture(index)
    if cap.isOpened():
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        caps[name] = cap
    else:
        print(f"❌ Camera {name} not available")

app = FastAPI()

# CORS (important for Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def draw_focus_box(img, x, y, w, h, color=(0, 255, 0), thickness=2, length=20):
    # top-left
    cv2.line(img, (x, y), (x + length, y), color, thickness)
    cv2.line(img, (x, y), (x, y + length), color, thickness)
    # top-right
    cv2.line(img, (x + w, y), (x + w - length, y), color, thickness)
    cv2.line(img, (x + w, y), (x + w, y + length), color, thickness)
    # bottom-left
    cv2.line(img, (x, y + h), (x + length, y + h), color, thickness)
    cv2.line(img, (x, y + h), (x, y + h - length), color, thickness)

    # bottom-right
    cv2.line(img, (x + w, y + h), (x + w - length, y + h), color, thickness)
    cv2.line(img, (x + w, y + h), (x + w, y + h - length), color, thickness)

#    top left
def generate_frames(camera_name: str):
    cap = caps.get(camera_name)
    if cap is None:
        return

    # 🔒 create LOCAL classifier (important!)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.4,
            minNeighbors=5)
        for (x, y, w, h) in faces:
            draw_focus_box(frame, x, y, w, h)
        _, buffer = cv2.imencode(".jpg", frame)

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + buffer.tobytes()
            + b"\r\n"
        )

@app.get("/video/{camera_name}")
def video_feed(camera_name: str):
    if camera_name not in caps:
        return {"error": "Camera not found"}

    return StreamingResponse(
        generate_frames(camera_name),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
