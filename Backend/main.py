from fastapi import FastAPI, Form, File, UploadFile,Response
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
from insightface.app import FaceAnalysis
from functions import All
from datetime import datetime, time as dt_time
import threading
import os
import random
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from database.db import eng_collection as db
from database.db import eng_collection
from urllib.parse import quote
from telegram_service import send_message,start_telegram_bot
from pymongo import DESCENDING
from fastapi import HTTPException
from bson import ObjectId
from typing import List, Optional
import shutil
import threading
from datetime import datetime, timedelta,time
from database.db import start_end_time
from database.db import cameras_collection
from database.db import UsersCollectiosn
from telegram_service import attendance_requests, request_lock, TIMEOUT_SECONDS, check_attendance_request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import warnings
warnings.filterwarnings("ignore")
# cameras = list(cameras_collection.find())

# full_address = []   
# camindex = {}      

# for index, cam in enumerate(cameras):
#     cam_name = cam.get("camera_name")
#     username = cam.get("username")
#     password = cam.get("password")
#     ipaddress = cam.get("ipaddress")
#     rtsp_url = f"rtsp://{username}:{password}@{ipaddress}"

#     full_address.append(rtsp_url)
#     camindex[cam_name] = rtsp_url

# ================= CONFIG =================

CAMERA_INDEX = {"herat": "rtsp://admin:D@iNas0r@192.168.100.51:554/cam/realmonitor?channel=1&subtype=0", "kabul":1, "mazar": 2}
IMAGE_FOLDER = "engineers_images"
ATT_INTERVAL = 3600 

# ================= GLOBAL STATE =================
camera_frames = {name: None for name in CAMERA_INDEX}
frame_locks = {name: threading.Lock() for name in CAMERA_INDEX}
recognized_per_camera = {}
recognized_lock = threading.Lock()
last_seen = {}
attendance_lock = threading.Lock()

# ================= PATHS =================
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
EMB_DIR = os.path.join(PROJECT_ROOT, "embeddings")

os.makedirs(EMB_DIR, exist_ok=True)
os.makedirs(IMAGE_FOLDER, exist_ok=True)

# ================= FACE MODEL =================
face_app = FaceAnalysis(name="buffalo_l", providers=['CUDAExecutionProvider','CPUExecutionProvider'])
face_app.prepare(ctx_id=0, det_size=(320,320))


# ================= LOAD EMBEDDINGS =================
def load_embeddings():
    emb_path = os.path.join(EMB_DIR, "faceEmbeddings.npy")
    names_path = os.path.join(EMB_DIR, "names.npy")
    emails_path = os.path.join(EMB_DIR, "emails.npy")

    if not os.path.isfile(emb_path) or not os.path.isfile(names_path) or not os.path.isfile(emails_path):
        return np.empty((0, 512)), np.array([]), np.array([])
    try:
        embeddings = np.load(emb_path)
        names = np.load(names_path, allow_pickle=True)
        emails = np.load(emails_path, allow_pickle=True)

        if embeddings.ndim == 1:
            embeddings = embeddings.reshape(1, -1)

        return embeddings, names, emails
    except Exception as e:
        print("Embedding load error:", e)
        return np.empty((0, 512)), np.array([]), np.array([])

face_embeddings, face_names, face_emails = load_embeddings()
print(face_emails)

# ================= FASTAPI =================
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====================== route for Login =========================
class datainfo(BaseModel):
    name:str
    lastname:str
    email:str
    password:str
SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_ME"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
# @app.post('/addemp')
# def addEmp(data:datainfo,respons:Response):
#     if UsersCollectiosn.find_one({'email':data.email}):
#         raise HTTPException(status_code=400,detail="This User already exist !")
#     UsersCollectiosn.insert_one({'name':data.name,'lastName':data.lastname,'email':data.email,'password':data.password})
#     hash_password=hash_password(data.email)
#     token=create_access_token({'email':data.email})
#     respons.set_cookie(
#         key='access_token',
#         value=token,
#         httponly=True,
#         secure=False,
#         samesite='1ax',
#         max_age=60*60*24*7
#     )
#     return{
#        'message':"User is created"
#     }

@app.post("/addCamera")
def add_camera(
    camname: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    ipaddress: str = Form(...),
):
   
    if not camname.strip():
        raise HTTPException(status_code=400, detail="Camera name is required")
    if not username.strip():
        raise HTTPException(status_code=400, detail="Username is required")
    if not password.strip():
        raise HTTPException(status_code=400, detail="Password is required")
    if not ipaddress.strip():
        raise HTTPException(status_code=400, detail="IP address is required")
    import re
    ip_pattern = r"^(?:\d{1,3}\.){3}\d{1,3}$"
    if not re.match(ip_pattern, ipaddress):
        raise HTTPException(status_code=400, detail="Invalid IP address format")
    cameras_collection.insert_one({
        "camera_name": camname,
        "username": username,
        "password": password,
        "ipaddress": ipaddress,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

@app.post('/time')
def specify_time(start: str = Form(...), end: str = Form(...)):
    start_end_time.insert_one({
        'start': start,
        'end': end,
        'createdat':datetime.now().strftime("%Y-%m-%d")
    })
    return {"message": "Insert time is created successfully"}


# @app.get('/latency/{empemail}')
# def getLatency(empemail: str):
#     employee = list(db.attendance_collection.find(
#         {'email': empemail},
#         {'_id': 0, 'entrance_time': 1, 'leaving_time': 1}
#     ))

#     # Get scheduled work times
#     worktime = start_end_time.find_one()
#     start_str = worktime['start'] if worktime else None
#     end_str = worktime['end'] if worktime else None
#     start_time = time(int(start_str), 0) if start_str else None
#     end_time = time(int(end_str), 0) if end_str else None

#     results = []

#     for record in employee:
#         entrance_time = record.get('entrance_time')
#         leaving_time = record.get('leaving_time')

#         if not entrance_time or not leaving_time:
#             continue

        
#         entrance = max(entrance_time, datetime.combine(entrance_time.date(), start_time))
#         leaving = min(leaving_time, datetime.combine(leaving_time.date(), end_time))

#         if entrance >= leaving:
#             total_absent = timedelta(hours=end_time.hour - start_time.hour)
#         else:
#             # Late arrival
#             late = entrance - datetime.combine(entrance_time.date(), start_time) if entrance_time.time() > start_time else timedelta(0)
#             # Early leaving
#             early_leave = datetime.combine(leaving_time.date(), end_time) - leaving if leaving_time.time() < end_time else timedelta(0)
#             total_absent = late + early_leave

#         # Convert to hours and minutes
#         hours = total_absent.seconds // 3600
#         minutes = (total_absent.seconds % 3600) // 60

#         results.append({
#             'date': entrance_time.date().strftime('%Y-%m-%d'),
#             'entrance': entrance_time.strftime('%H:%M'),
#             'leaving': leaving_time.strftime('%H:%M'),
#             'absent_hours': hours,
#             'absent_minutes': minutes
#         })

#     return {"employee_email": empemail, "absent_records": results}
        


@app.get('/latency/{empemail}')

def getLatency(empemail: str):
    employee = list(db.attendance_collection.find(
        {'email': empemail},
        {'_id': 0, 'entrance_time': 1, 'leaving_time': 1}
    ))

    # Get scheduled work times
    worktime = start_end_time.find_one({},sort=[("_id", -1)])
    start_str = worktime['start'] if worktime else None
    end_str = worktime['end'] if worktime else None
    start_time = time(int(start_str), 0) if start_str else None
    end_time = time(int(end_str), 0) if end_str else None

    total_absent = timedelta(0)

    for record in employee:
        entrance_time = record.get('entrance_time')
        leaving_time = record.get('leaving_time')

        if not entrance_time or not leaving_time:
            continue

        entrance = max(entrance_time, datetime.combine(entrance_time.date(), start_time))
        leaving = min(leaving_time, datetime.combine(leaving_time.date(), end_time))

        if entrance >= leaving:
            day_absent = datetime.combine(entrance_time.date(), end_time) - datetime.combine(entrance_time.date(), start_time)
        else:
            # Late arrival
            late = entrance - datetime.combine(entrance_time.date(), start_time) if entrance_time.time() > start_time else timedelta(0)
            # Early leaving
            early_leave = datetime.combine(leaving_time.date(), end_time) - leaving if leaving_time.time() < end_time else timedelta(0)
            day_absent = late + early_leave

        total_absent += day_absent

    # Convert to hours and minutes
    hours = total_absent.seconds // 3600
    minutes = (total_absent.seconds % 3600) // 60

    return {"employee_email": empemail, "total_late_hours": hours, "total_late_minutes": minutes}
    
def takeAttendance(person_name: str, person_email: str):
    now = datetime.now()   
    today = now.strftime("%Y-%m-%d")
    current_time = now.time()
    
    with attendance_lock:
  
        record = db.attendance_collection.find_one({
            "name": person_name,
            "date": today,
            "email": person_email
        })
        person =eng_collection.find_one({'email':person_email},{'_id':0,"tid":1})
        telegramid=int(person['tid'] if person else None)
        currenttime=datetime.now().strftime("%H-%M-%S")

        if not record:
            # No record yet → insert entrance
            db.attendance_collection.insert_one({
                "name": person_name,
                "email": person_email,
                "date": today,
                "entrance_time": now,
                "leaving_time": None,
                "present": False,
                "createdAt": today
            })
            
            print(f"[ENTRANCE] {person_name} at {now.strftime('%H:%M:%S')}")
            
            send_message(telegramid,message=f'Enterance Time:{currenttime}')
            return
        if record:
            send_message(user_id=telegramid,message="Your attendance is already done!")
        # ---------------- EXIT ----------------
        if record.get("entrance_time") and record.get("leaving_time") is None:
            
            db.attendance_collection.update_one(
                {"_id": record["_id"]},
                {"$set": {"leaving_time": now}}
            )
            print(f"[EXIT] {person_name} at {now.strftime('%H:%M:%S')}")

        # ---------------- MARK PRESENT ----------------
        record = db.attendance_collection.find_one({
            "name": person_name,
            "date": today,
            "email": person_email
        })
        if record.get("entrance_time") and record.get("leaving_time") and not record.get("present"):
            db.attendance_collection.update_one(
                {"_id": record["_id"]},
                {"$set": {"present": True}}
            )
        
            person = eng_collection.find_one(
                {'email': person_email},
                {'_id': 0, 'tid': 1, 'name': 1, 'lastName': 1}
            )
            attendancetime = db.attendance_collection.find_one(
                {'email': person_email},
                {"_id": 0, 'entrance_time': 1, "leaving_time": 1}
            )

            enteringTime = attendancetime['entrance_time'] if attendancetime else None
            LeavingTime = attendancetime['leaving_time'] if attendancetime else None

            telegramID = int(person['tid']) if person else None
            name = person['name'] if person else None
            lastname = person['lastName'] if person else None

            enteringTime_str = enteringTime.strftime("%H:%M") if enteringTime else "N/A"
            LeavingTime_str = LeavingTime.strftime("%H:%M") if LeavingTime else "N/A"

            message = (
                f"📋 *Daily Attendance Summary*\n\n"
                f"Dear *{name} {lastname}*,\n\n"
                f"Your attendance has been successfully recorded for *{today}*.\n\n"
                f"🟢 *Check-in Time:* {enteringTime_str}\n"
                f"🔴 *Check-out Time:* {LeavingTime_str}\n\n"
                f"Thank you for your dedication and commitment.\n\n"
                f"— *FarsRout ISP | HR Department* 💼"
            )

            send_message(user_id=telegramID, message=message)
def upsence_attendance():
    todayname=datetime.now().strftime("%A")
    if todayname!='Friday':
        today=datetime.now().strftime('%Y-%m-%d')
        AllEngineers=list(eng_collection.find({},{'name':1,"email":1,"tid":1,"lastName":1}))

        today_attendance = db.attendance_collection.find(
            {"date": today},
            {"email": 1}
        )
        engemails={erf['email'] for erf in today_attendance}
        for eng in AllEngineers:
            if eng['email'] not in engemails:
                db.attendance_collection.insert_one({
                    'name':eng['name'],
                    'email':eng['email'],
                    "date":today,
                    'entrance_time':None,
                    'leaving_time':None,
                    'present':False,
                    "createdAt":today
                })
                engId=int(eng['tid'] if eng else None)
                name=eng['name'] if eng else None
                last_name=eng['lastName'] if eng else None
                send_message(user_id=engId, message=(f"📌 *Attendance Notification*\n\n"
                        f"👤 *Employee:* {name} {last_name}\n"
                        f"📅 *Date:* {today}\n\n"
                        f"❌ *Status:* Absent\n\n"
                        f"If this status is incorrect or you have a valid reason, please inform the HR department.\n\n"
                        f"— *FarsRout ISP | HR Department*"
                        )
                         )
    
# =================function for kepping start for ever the telgram bot=============
@app.on_event("startup")
def startup_event():
    start_telegram_bot()


def generate_frames(camera_name: str):
    while True:
        with frame_locks[camera_name]:
            frame = camera_frames[camera_name]
            if frame is None:
                continue
        ret, buffer = cv2.imencode(".jpg", frame)
        if not ret:
            continue
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + buffer.tobytes()
            + b"\r\n"
        )

@app.get('/video_feed/{camera_name}')
def video_feed(camera_name: str):
    return StreamingResponse(generate_frames(camera_name), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/live_camera/{camera_name}")
def live_camera(camera_name: str):
    if camera_name not in CAMERA_INDEX:
        return JSONResponse({"error": "Invalid camera"}, status_code=404)
    return StreamingResponse(generate_frames(camera_name), media_type="multipart/x-mixed-replace; boundary=frame")

# ================= ENGINEER IMAGE =================
@app.get("/engineer_image/{person_name}")
def get_engineer_image(person_name: str):
    person_dir = os.path.join(IMAGE_FOLDER, person_name)
    if not os.path.isdir(person_dir):
        return JSONResponse({"error": "Person not found"}, status_code=404)
    images = os.listdir(person_dir)
    if not images:
        return JSONResponse({"error": "No images"}, status_code=404)
    return FileResponse(os.path.join(person_dir, images[0]))

# ================= RECOGNITION API =================
@app.get("/recognized")
def get_recognized():
    with recognized_lock:
        return recognized_per_camera

def generate_custom_id():
    prefix = "EMP0000"  # fixed part

    random_num = random.randint(1000, 9999)
    while db.find_one({"custom_id": f"{prefix}{random_num:04d}"}):
        random_num = random.randint(1000, 9999)

    new_id = f"{prefix}{random_num:04d}"
    return new_id

# ================= ADD ENGINEER =================

def load_embeddings_safe():
    try:
        embeddings = np.load(os.path.join(EMB_DIR, "faceEmbeddings.npy"))
        names = np.load(os.path.join(EMB_DIR, "names.npy"))
        emails = np.load(os.path.join(EMB_DIR, "emails.npy"))
    except:
        embeddings = np.empty((0, 512))
        names = np.array([])
        emails = np.array([])
    return embeddings, names, emails

@app.post("/add-engineer")
async def add_engineer(
    name: str = Form(...),
    lastName: str = Form(...),
    email: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    phone: str = Form(...),
    tid: str = Form(...),
    images: list[UploadFile] = File(...),
):
    global face_embeddings, face_names, face_emails

    if db.find_one({'email':email}):
        raise HTTPException(status_code=400,detail="This user already exist ")

    person_dir = os.path.join(IMAGE_FOLDER, f"{name}_{email}")
    os.makedirs(person_dir, exist_ok=True)

    saved_images = []
    new_embeddings = []
    new_names = []
    new_emails = []

    for i, img in enumerate(images):
        ext = os.path.splitext(img.filename)[1]
        filename = f"{name}_{int(datetime.now().timestamp())}_{i}{ext}"
        path = os.path.join(person_dir, filename)

        with open(path, "wb") as f:
            f.write(await img.read())

        saved_images.append(path)

        img_bgr = cv2.imread(path)
        if img_bgr is None:
            continue

        faces = face_app.get(img_bgr)
        if faces:
            new_embeddings.append(faces[0].embedding)
            new_names.append(f"{name}_{email}")
            new_emails.append(email)

    # Load existing embeddings
    old_emb, old_names, old_emails = load_embeddings_safe()

    # Append new data
    face_embeddings = np.vstack([old_emb, new_embeddings])
    face_names = np.concatenate([old_names, new_names])
    face_emails = np.concatenate([old_emails, new_emails])

    # Save back
    np.save(os.path.join(EMB_DIR, "faceEmbeddings.npy"), face_embeddings)
    np.save(os.path.join(EMB_DIR, "names.npy"), face_names)
    np.save(os.path.join(EMB_DIR, "emails.npy"), face_emails)
    custom_id = generate_custom_id()

    db.insert_one({
        'custom':custom_id,
        "name": name,
        "lastName": lastName,
        "email": email,
        "address": address,
        "city": city,
        "phone": phone,
        "tid": tid,
        "images": saved_images,
        "created_at": datetime.utcnow()
    })
    telegramID=int(tid)
    username=name
    last=lastName
    send_message(
    user_id=telegramID,message=f"🎉 Congratulations {username} {last}! 🎉\n\n"
            f"We are delighted to inform you that you have been officially hired at **FarsRout ISP Company**.\n\n"
            f"Welcome to the team! We’re excited to have you with us and look forward to achieving great things together. 🚀\n\n"
            f"If you have any questions or need assistance, feel free to reach out.\n\n"
            f"Best regards,\n"
            f"FarsRout ISP Management"
)
    return {"message": f"Engineer {name} added successfully"}
# ================= GET ALL ENGINEERS =================
@app.get("/all_engineers")
def get_all_engineers():
    engineers = list(db.find())
    for eng in engineers:
        eng["_id"] = str(eng["_id"])
        eng_name=eng['name']
        engEmail=eng['email']
        concat=f"{eng_name}_{engEmail}"
        print(concat)
        if eng.get("name"):
            eng["image"] = f"http://localhost:8000/engineer_image/{concat}"

        else:
            eng["image"] = None
        eng.pop("images", None)
    return engineers


# ===============Get a engineer based on ID================
@app.get("/eng/{eng_id}")
def getbyID(eng_id: str):
    engineer = eng_collection.find_one({"custom": eng_id})

    if not engineer:
        raise HTTPException(status_code=404, detail="Engineer Not Found")

    engineer["_id"] = str(engineer["_id"])

    # ===== Add image URL =====
    eng_name = engineer.get("name")
    eng_email = engineer.get("email")
    if eng_name and eng_email:
        concat = f"{eng_name}_{eng_email}"
        engineer["image"] = f"http://localhost:8000/engineer_image/{concat}"
    else:
        engineer["image"] = None
    engineer.pop("images", None)

    return engineer

# =====================Get all attendances for a one person based on Id===============

@app.get('/allattendance/{eng_email}')
def getallattendance(eng_email: str):

    attendances = list(
        db.attendance_collection.find({"email": eng_email})
    )

    if not attendances:
        raise HTTPException(status_code=404, detail="No attendance found")

    worktime = start_end_time.find_one()
    work_start = time(int(worktime["start"]), 0)
    work_end = time(int(worktime["end"]), 0)

    results = []

    for atd in attendances:
        entrance_time = atd.get("entrance_time")
        leaving_time = atd.get("leaving_time")

        latency_minutes = 0

        if entrance_time and leaving_time:
            work_start_dt = datetime.combine(entrance_time.date(), work_start)
            work_end_dt = datetime.combine(leaving_time.date(), work_end)

            # Clamp times
            actual_start = max(entrance_time, work_start_dt)
            actual_end = min(leaving_time, work_end_dt)

            # Total expected work time
            expected_work = work_end_dt - work_start_dt

            # Actual worked time
            worked_time = max(actual_end - actual_start, timedelta(0))

            # Latency = time not worked
            absent_time = expected_work - worked_time
            latency_minutes = max(int(absent_time.total_seconds() // 60), 0)

        atd["_id"] = str(atd["_id"])
        atd["latency"] = latency_minutes  
        results.append(atd)
    return results


# @app.get('/allattendance/{eng_email}')
# def getallattendance(eng_email: str):
#     attendances = list(
#         db.attendance_collection.find({"email": eng_email})
#     )

#     if not attendances:
#         raise HTTPException(status_code=404, detail="No attendance found")

#     # Get work time (example: 8 to 16)
#     worktime = start_end_time.find_one({})
#     if not worktime:
#         raise HTTPException(status_code=500, detail="Work time not set")

#     work_start = time(int(worktime["start"]), 0)  # 08:00
#     work_end = time(int(worktime["end"]), 0)      # 16:00

#     results = []

#     for atd in attendances:
#         entrance = atd.get("entrance_time")
#         leaving = atd.get("leaving_time")

#         latency_minutes = 0

#         if entrance and leaving:
#             work_start_dt = datetime.combine(entrance.date(), work_start)
#             work_end_dt = datetime.combine(entrance.date(), work_end)

#             # Late arrival
#             if entrance > work_start_dt:
#                 late = entrance - work_start_dt
#                 latency_minutes += int(late.total_seconds() / 60)

#             # Early leaving
#             if leaving < work_end_dt:
#                 early = work_end_dt - leaving
#                 latency_minutes += int(early.total_seconds() / 60)

#         results.append({
#             "_id": str(atd["_id"]),
#             "date": entrance.date().strftime('%Y-%m-%d') if entrance else None,
#             "latency": latency_minutes
#         })

#     return results

# def camera_worker(camera_name: str, index: int):
#     cap = cv2.VideoCapture(index)
#     if not cap.isOpened():
#         print(f"Camera {camera_name} failed")
#         return

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             continue
#         faces = face_app.get(frame, max_num=4)

#         for face in faces:
#             x1, y1, x2, y2 = map(int, face.bbox)
#             emb = face.embedding.reshape(1, -1)
#             display_name = "Unknown"
#             person_name = ""
#             person_email = ""
#             telegram_id = None
#             if face_embeddings.shape[0] > 0:
#                 sims = cosine_similarity(emb, face_embeddings)
#                 idx = np.argmax(sims)
#                 if sims[0][idx] > 0.5:
#                     person_email = face_emails[idx]
#                     full_name = face_names[idx] 
#                     person_name = full_name
#                     display_name = full_name.split('_')[0]
#                     user = eng_collection.find_one({'email': person_email}, {'_id': 0, 'tid': 1})
#                     telegram_id = int(user['tid']) if user else None
#                     if telegram_id:
#                         action = check_attendance_request(telegram_id)
#                         if action == "entrance" or action=='exit':
#                             today_name = datetime.now().strftime("%A")
#                             if today_name != 'Friday':
#                                 takeAttendance(person_name, person_email)
#                                 print(f"[TELEGRAM ENTERANCE] {display_name} marked attendance via Telegram button")

#                     with recognized_lock:
#                         recognized_per_camera[camera_name] = {
#                             "name": person_name,
#                             "image": f"/engineer_image/{person_name}"
#                         }

#                     COLOR_MATCHED = (238, 211, 34)  
#                     COLOR_UNKNOWN = (80, 70, 244)  

                 
#                     text_color = COLOR_MATCHED if display_name != "Unknown" else COLOR_UNKNOWN

#                     cv2.putText(
#                         frame,
#                         display_name.upper(),
#                         (x1, y1 - 12),
#                         cv2.FONT_HERSHEY_SIMPLEX,
#                         0.6,               
#                         text_color,
#                         2,                 
#                         cv2.LINE_AA       
#                     )
#             COLOR_CYAN = (238, 211, 34)   
#             COLOR_DANGER = (80, 70, 244) 
#             rect_color = COLOR_CYAN if display_name != "Unknown" else COLOR_DANGER
#             All.draw_focus_box(frame, x1, y1, x2 - x1, y2 - y1)
#             All.Draw_rectagle(frame, x1, y1, x2, y2, rect_color, 1)


#         with frame_locks[camera_name]:
#             camera_frames[camera_name] = frame.copy()

  
#         current_time = datetime.now()
#         if dt_time(17, 0) <= current_time <= dt_time(18, 0):
#             upsence_attendance()

#     cap.release()


def camera_worker(camera_name: str, index: int):
    cap = cv2.VideoCapture(index)
    if not cap.isOpened():
        print(f"Camera {camera_name} failed")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        faces = face_app.get(frame, max_num=4)

        for face in faces:
            x1, y1, x2, y2 = map(int, face.bbox)
            emb = face.embedding.reshape(1, -1)
            display_name = "Unknown"
            person_name = ""
            person_email = ""
            telegram_id = None
            if face_embeddings.shape[0] > 0:
                sims = cosine_similarity(emb, face_embeddings)
                idx = np.argmax(sims)
                if sims[0][idx] > 0.5:
                    person_email = face_emails[idx]
                    full_name = face_names[idx] 
                    person_name = full_name
                    display_name = full_name.split('_')[0]
                    user = eng_collection.find_one({'email': person_email}, {'_id': 0, 'tid': 1})
                    telegram_id = int(user['tid']) if user else None
                    if telegram_id:
                        action = check_attendance_request(telegram_id)
                        if action == "entrance" or action=='exit':
                            today_name = datetime.now().strftime("%A")
                            if today_name != 'Friday':
                                takeAttendance(person_name, person_email)
                                print(f"[TELEGRAM ENTERANCE] {display_name} marked attendance via Telegram button")
                    with recognized_lock:
                        recognized_per_camera[camera_name] = {
                            "name": person_name,
                            "image": f"/engineer_image/{person_name}"
                        }
                    COLOR_MATCHED = (238, 211, 34)  
                    COLOR_UNKNOWN = (80, 70, 244)  
                    text_color = COLOR_MATCHED if display_name != "Unknown" else COLOR_UNKNOWN
                    cv2.putText(
                        frame,
                        display_name.upper(),
                        (x1, y1 - 12),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6,               
                        text_color,
                        2,                 
                        cv2.LINE_AA       
                    )
            COLOR_CYAN = (238, 211, 34)   
            COLOR_DANGER = (80, 70, 244) 
            rect_color = COLOR_CYAN if display_name != "Unknown" else COLOR_DANGER
            All.draw_focus_box(frame, x1, y1, x2 - x1, y2 - y1)
            All.Draw_rectagle(frame, x1, y1, x2, y2, rect_color, 1)


        with frame_locks[camera_name]:
            camera_frames[camera_name] = frame.copy()

  
        current_time = datetime.now().time()
        if dt_time(17, 0) <= current_time <= dt_time(18, 0):
            upsence_attendance()

    cap.release()




@app.get('/countall')
def CounallEngs():
    count=eng_collection.count_documents({})
    return {"AllEngineers":count}

@app.get('/presentedEmps')
def countPresented():
    today = datetime.now().strftime("%Y-%m-%d")
    countP=db.attendance_collection.count_documents({
        "date":today,
        "present":True
    })
    return {"message":countP}
  


# =================== get A Engineer based on the ID ===========

@app.get("/specific/{eng_id}")
def get_engineer(eng_id: str):
    try:
        oid = ObjectId(eng_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

    engineer = db.find_one({"_id": oid})
    if not engineer:
        raise HTTPException(status_code=404, detail="Engineer not found")

    engineer["_id"] = str(engineer["_id"])
    return engineer
@app.put("/update-engineer/{eng_id}")
async def update_engineer(
    eng_id: str,
    name: str = Form(...),
    lastName: str = Form(...),
    email: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    phone: str = Form(...),
    tid: str = Form(...),
    images: Optional[List[UploadFile]] = File(None),
):
    global face_embeddings, face_names, face_emails

    try:
        oid = ObjectId(eng_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid engineer ID")

    engineer = db.find_one({"_id": oid})
    if not engineer:
        raise HTTPException(status_code=404, detail="Engineer not found")

    old_key = f"{engineer['name']}_{engineer['email']}"
    new_key = f"{name}_{email}"

    person_dir = os.path.join(IMAGE_FOLDER, new_key)
    saved_images = engineer.get("images", [])

    # ===============================
    # IF IMAGES UPDATED → UPDATE EMBEDDINGS
    # ===============================
    if images and len(images) > 0:

        # 1️⃣ Remove old embeddings for this engineer
        keep_idx = [i for i, n in enumerate(face_names) if n != old_key]

        face_embeddings = face_embeddings[keep_idx]
        face_names = face_names[keep_idx]
        face_emails = face_emails[keep_idx]

        # 2️⃣ Remove old images
        if os.path.exists(person_dir):
            shutil.rmtree(person_dir)

        os.makedirs(person_dir, exist_ok=True)
        saved_images = []

        new_embeddings = []
        new_names = []
        new_emails = []

        # 3️⃣ Save new images + generate embeddings
        for i, img in enumerate(images):
            ext = os.path.splitext(img.filename)[1]
            filename = f"{name}_{int(datetime.now().timestamp())}_{i}{ext}"
            path = os.path.join(person_dir, filename)

            with open(path, "wb") as f:
                f.write(await img.read())

            saved_images.append(path)

            img_bgr = cv2.imread(path)
            if img_bgr is None:
                continue

            faces = face_app.get(img_bgr)
            if faces:
                new_embeddings.append(faces[0].embedding)
                new_names.append(new_key)
                new_emails.append(email)

        # 4️⃣ Append new embeddings
        if new_embeddings:
            face_embeddings = np.vstack([face_embeddings, new_embeddings])
            face_names = np.concatenate([face_names, new_names])
            face_emails = np.concatenate([face_emails, new_emails])

        # 5️⃣ Save updated embeddings
        np.save(os.path.join(EMB_DIR, "faceEmbeddings.npy"), face_embeddings)
        np.save(os.path.join(EMB_DIR, "names.npy"), face_names)
        np.save(os.path.join(EMB_DIR, "emails.npy"), face_emails)

    # ===============================
    # UPDATE DATABASE (ALWAYS)
    # ===============================
    db.update_one(
        {"_id": oid},
        {"$set": {
            "name": name,
            "lastName": lastName,
            "email": email,
            "address": address,
            "city": city,
            "phone": phone,
            "tid": tid,
            "images": saved_images,
            "updated_at": datetime.utcnow()
        }}
    )

    return {"message": f"Engineer {name} updated successfully"}




@app.delete("/delete-engineer/{eng_id}")
async def delete_engineer(eng_id: str):
    global face_embeddings, face_names, face_emails

    try:
        oid = ObjectId(eng_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid engineer ID")

    engineer = db.find_one({"_id": oid})
    if not engineer:
        raise HTTPException(status_code=404, detail="Engineer not found")

    key = f"{engineer['name']}_{engineer['email']}"

    # -----------------------------
    # Remove embeddings from memory
    # -----------------------------
    keep_idx = [i for i, n in enumerate(face_names) if n != key]

    face_embeddings = face_embeddings[keep_idx]
    face_names = face_names[keep_idx]
    face_emails = face_emails[keep_idx]

 
    np.save(os.path.join(EMB_DIR, "faceEmbeddings.npy"), face_embeddings)
    np.save(os.path.join(EMB_DIR, "names.npy"), face_names)
    np.save(os.path.join(EMB_DIR, "emails.npy"), face_emails)

 
    if engineer.get("images"):
        folder_path = os.path.dirname(engineer["images"][0])
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

    db.delete_one({"_id": oid})

    return {"message": f"Engineer {engineer['name']} deleted successfully"}
@app.get('/upsentEmps')
def ussentEmps():
    today = datetime.now().strftime("%Y-%m-%d")
    countUps=db.attendance_collection.count_documents({
        'date':today,
        'present':False
    })
    return {"upsentEmp":countUps}


# ================= START CAMERA THREADS =================
@app.on_event("startup")
def start_cameras():
    for name, index in CAMERA_INDEX.items():
        threading.Thread(target=camera_worker, args=(name, index), daemon=True).start()
