import cv2
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


cameras = {
    "herat": 0,
    "kabul": 1,
    "mazar": 2
}
caps={}

def draw_focus_box(img, x, y, w, h, color=(232, 223, 33), thickness=4, length=30):
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

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load for setting the cameras
for name, cams in cameras.items():
    cap=cv2.VideoCapture(cams)
    if cap.isOpened():
        cap.set(cv2.CAP_PROP_FRAME_WIDTH,640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT,480)
        caps[name]=cap
    else:
        print("sorry something went wrong with openning the cameras")
def generateFrame(cameraName:str):
    cap=caps.get(cameraName)
    if cap is None:
        return
    face_cascade=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
    while True:
        ret,frame=cap.read()
        frame=cv2.flip(frame,1)
        gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)

        faces=face_cascade.detectMultiScale(gray,1.3,5)
        for (x,y,w,h) in faces:
            draw_focus_box(frame,x,y,w,h)
            
        _, buffer = cv2.imencode(".jpg", frame)
  
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + buffer.tobytes()
            + b"\r\n"
        )


@app.get("/video/{camera_name}")
def video_feed(camera_name : str):
    if camera_name not in caps:
       return {"error": "Camera not found"}

    return StreamingResponse(
        generateFrame(camera_name),
         media_type="multipart/x-mixed-replace; boundary=frame"
    )
