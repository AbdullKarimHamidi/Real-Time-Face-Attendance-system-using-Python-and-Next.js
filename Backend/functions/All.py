# import cv2
# import numpy as np

# from insightface.app import FaceAnalysis
# from sklearn.metrics.pairwise import cosine_similarity
# import os
# from datetime import datetime
# import time
# import threading


# def draw_focus_box(img, x, y, w, h, color=(0, 255, 0), thickness=4, length=20):
#     # top-left
#     cv2.line(img, (x, y), (x + length, y), color, thickness)
#     cv2.line(img, (x, y), (x, y + length), color, thickness)

#     # top-right
#     cv2.line(img, (x + w, y), (x + w - length, y), color, thickness)
#     cv2.line(img, (x + w, y), (x + w, y + length), color, thickness)

#     # bottom-left
#     cv2.line(img, (x, y + h), (x + length, y + h), color, thickness)
#     cv2.line(img, (x, y + h), (x, y + h - length), color, thickness)

#     # bottom-right
#     cv2.line(img, (x + w, y + h), (x + w - length, y + h), color, thickness)
#     cv2.line(img, (x + w, y + h), (x + w, y + h - length), color, thickness)


# def Draw_rectagle(img,x,y,x2,y2,color,thickness):
#     cv2.rectangle(img,(x,y),(x2,y2),color,thickness)




# cameras={
#     "Herat":0,
#     "Kabul":1,
#     "Mazar":2
# }
# interval=5
# last_Seen={}
# lock_Threadig=threading.Lock()
# app=FaceAnalysis(name="buffalo_l", providers=["CUDAExecutionProvider"])
# app.prepare(ctx_id=0, det_size=(320, 320))
# caps={}


# CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# PROJECT_ROOT = os.path.dirname(CURRENT_DIR)                
# EMB_DIR = os.path.join(PROJECT_ROOT, "embeddings")

# face_embedding = np.load(os.path.join(EMB_DIR, "faceEmbeddings.npy"))
# names = np.load(os.path.join(EMB_DIR, "names.npy"), allow_pickle=True)
    
# for name,index in cameras.items():
#     cap=cv2.VideoCapture(index)
#     if not cap.isOpened():
#         print(f" Cannot open camera: {name}")
#     caps[name]=cap

# def takeAttendance(name,db):
#     global interval,last_Seen
#     if name  not in last_Seen:
#         last_Seen[name]=0
#     current_time=time.time()
#     if current_time-last_Seen[name]>interval:
#         dtstamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#         db.Attendace_collection.insert_one({"name":name,"time":dtstamp})
#         last_Seen[name]=current_time
# def TakeAttendance():
#     while True:
#         for name ,cap in caps.items():
#             ret,frame=cap.read()
#             if not ret:
#                 print(f" Failed to read frame from camera: {name}")
#                 continue
#             frame=cv2.flip(frame,1)
#             faces=app.get(frame,max_num=4)
#             for face in faces:
#                 x1,y1,x2,y2=map(int,face.bbox)
#                 embeddig=face.embedding.reshape(1,-1)
#                 sims=cosine_similarity(embeddig,face_embedding)
#                 index=np.argmax(sims)
#                 sim=sims[0][index]
#                 if sim>0.5:
#                     person_name=names[index]
#                     cv2.putText(frame,person_name,(x1,y1-10),cv2.FONT_HERSHEY_SIMPLEX,0.9,(0,255,),2)
#                 else:
#                     person_name="Unknown"
#                     cv2.putText(frame,person_name,(x1,y1-10),cv2.FONT_HERSHEY_SIMPLEX,0.9,(0,0,255),2)
#                 draw_focus_box(frame,x1,y1,x2-x1,y2-y1)
#                 takeAttendance(person_name)

#             cv2.imshow(name,frame)
#             cv2.waitKey(1)
# TakeAttendance()
    

    

import cv2
import numpy as np
from insightface.app import FaceAnalysis
from sklearn.metrics.pairwise import cosine_similarity
import os
from datetime import datetime
import time
import threading

# ==================== UTILITY FUNCTIONS ====================
def draw_focus_box(img, x, y, w, h, color=(238, 211, 34), thickness=2, length=25):
    """
    Draws tactical corner brackets around a detected object.
    Default color is Tactical Cyan (BGR: 238, 211, 34)
    """
    # Define the 4 corners
    top_left = (x, y)
    top_right = (x + w, y)
    bottom_left = (x, y + h)
    bottom_right = (x + w, y + h)

    # Use cv2.LINE_AA for smoother, high-tech looking lines
    line_type = cv2.LINE_AA

    # top-left corner
    cv2.line(img, top_left, (x + length, y), color, thickness, line_type)
    cv2.line(img, top_left, (x, y + length), color, thickness, line_type)

    # top-right corner
    cv2.line(img, top_right, (x + w - length, y), color, thickness, line_type)
    cv2.line(img, top_right, (x + w, y + length), color, thickness, line_type)

    # bottom-left corner
    cv2.line(img, bottom_left, (x + length, y + h), color, thickness, line_type)
    cv2.line(img, bottom_left, (x, y + h - length), color, thickness, line_type)

    # bottom-right corner
    cv2.line(img, bottom_right, (x + w - length, y + h), color, thickness, line_type)
    cv2.line(img, bottom_right, (x + w, y + h - length), color, thickness, line_type)

    # Optional: Add a very faint semi-transparent box overlay
    # This mimics the "Intelligence Stream" look from your React UI
    overlay = img.copy()
    cv2.rectangle(overlay, (x, y), (x + w, y + h), color, 1)
    cv2.addWeighted(overlay, 0.15, img, 0.85, 0, img)
def Draw_rectagle(img, x, y, x2, y2, color, thickness):
    cv2.rectangle(img, (x, y), (x2, y2), color, thickness)

# ==================== CONFIG ====================
# cameras = {"Herat": 0, "Kabul": 1, "Mazar": 2}
# interval = 5
# last_seen = {}
# lock = threading.Lock()

# # ==================== FACE MODEL ====================
# app = FaceAnalysis(name="buffalo_l", providers=["CUDAExecutionProvider"])
# app.prepare(ctx_id=0, det_size=(320, 320))

# # ==================== LOAD EMBEDDINGS ====================
# CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
# EMB_DIR = os.path.join(PROJECT_ROOT, "embeddings")

# face_embedding = np.load(os.path.join(EMB_DIR, "faceEmbeddings.npy"))
# names = np.load(os.path.join(EMB_DIR, "names.npy"), allow_pickle=True)

# # ==================== CAMERA CAPTURES ====================
# caps = {}
# for name, index in cameras.items():
#     cap = cv2.VideoCapture(index)
#     if not cap.isOpened():
#         print(f"Cannot open camera: {name}")
#     else:
#         caps[name] = cap

# # ==================== ATTENDANCE FUNCTION ====================
# def takeAttendance(person_name, db):
#     global interval, last_seen
#     current_time = time.time()
#     with lock:
#         if person_name not in last_seen:
#             last_seen[person_name] = 0
#         if current_time - last_seen[person_name] > interval:
#             dtstamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#             db.Attendace_collection.insert_one({"name": person_name, "time": dtstamp})
#             last_seen[person_name] = current_time

# # ==================== PER-CAMERA THREAD ====================
# def process_camera(name, cap, db):
#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             print(f"Failed to read frame from camera: {name}")
#             continue

#         frame = cv2.flip(frame, 1)
#         faces = app.get(frame, max_num=4)

#         for face in faces:
#             x1, y1, x2, y2 = map(int, face.bbox)
#             embedding = face.embedding.reshape(1, -1)
#             sims = cosine_similarity(embedding, face_embedding)
#             idx = np.argmax(sims)
#             sim = sims[0][idx]

#             if sim > 0.5:
#                 person_name = names[idx]
#                 cv2.putText(frame, person_name, (x1, y1 - 10),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
#             else:
#                 person_name = "Unknown"
#                 cv2.putText(frame, person_name, (x1, y1 - 10),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

#             draw_focus_box(frame, x1, y1, x2 - x1, y2 - y1)
#             takeAttendance(person_name, db)

#         cv2.imshow(name, frame)
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

# # ==================== START THREADS ====================
# def start_attendance_threads(db):
#     threads = []
#     for name, cap in caps.items():
#         t = threading.Thread(target=process_camera, args=(name, cap, db), daemon=True)
#         t.start()
#         threads.append(t)
#     return threads

# ==================== EXAMPLE USAGE ====================
# from database.db import Attendace_collection as db
# threads = start_attendance_threads(db)
# while True:
#     time.sleep(1)  # keep main alive
