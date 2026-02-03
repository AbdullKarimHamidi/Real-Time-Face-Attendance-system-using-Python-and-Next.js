import os
import pickle
import json
import cv2
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware


cameras={
    "herat":0,
    "kabul":1,
    "mazar":2
}

caps={}

os.makedirs('data',exist_ok=True)
for name,index in cameras.items():
    cap=cv2.VideoCapture(index)
    if cap.isOpened():
        caps[name]=cap

def generateframe():
    while True:
        for name,cap in caps.items():
            ret,frame=cap.read()
            frame=cv2.flip(frame,1)
            ret,buffere=cv2.imencode('.jpg',frame)
            frame=buffere.tobytes()
            yield(
                b'--frame\r\n'
                b'Content-Type : image/jpeg\r\n\r\n'+ frame + b'\r\n'
            )
app=FastAPI()
@app.get('/video')
def showframe():
    return StreamingResponse(
        generateframe(),
         media_type="multipart/x-mixed-replace; boundary=frame"
    )


