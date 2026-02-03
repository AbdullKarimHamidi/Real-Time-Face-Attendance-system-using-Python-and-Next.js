import os 
import json
import pickle
import cv2
import numpy as np
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# variales
curretName=''
maxCount=50
collecting=False
count=0
faceinfo=[]


# make direction
os.makedirs('data',exist_ok=True)


app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def draw_focus_box(img, x, y, w, h, color=(255, 255, 255), thickness=2, length=20):
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


face_cascade=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
cap=cv2.VideoCapture(0)
def generateFrame():
    global count,maxCount,collecting,curretName,faceinfo
    while True:
        ret,frame=cap.read()
        frame=cv2.flip(frame,1)
        gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
        faces=face_cascade.detectMultiScale(gray,1.4,5)
        for (x,y,w,h) in faces:
            image_file=gray[y:y+h,x:x+w]
            imageResize=cv2.resize(image_file,(50,50))
            
            if collecting and count<maxCount:
                count+=1
                faceinfo.append(imageResize.flatten())
            # cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),3)
            draw_focus_box(frame,x,y,w,h)
            cv2.putText(frame,f'{count}/{maxCount}',(x,y-7),cv2.FONT_HERSHEY_SIMPLEX,0.7,(0,255,0),3)
            if collecting and count>=maxCount:
                saveInfo()
                collecting=False

        ret,buffer=cv2.imencode('.jpg',frame)
        frame=buffer.tobytes()
        yield(
            b'--frame\r\n'
            b'Content-Type : image/jpeg\r\n\r\n'+ frame + b'\r\n'
            
        )
@app.get('/video')
def showframe():
    return StreamingResponse(
        generateFrame(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


class NameRequest(BaseModel):
    name:str

@app.post('/start-collect')
def start_collect(data:NameRequest):
    global curretName,count,faceinfo,collecting
    curretName=data.name
    count=0
    faceinfo=[]
    collecting=True
    return {"message":f"collection is started for {data.name}"}



@app.get('/test')
def test():
    return {"message":"THis message will appear in the page"}
def saveInfo():
    global count,faceinfo,maxCount,curretName
    faceData=np.array(faceinfo)
    if os.path.exists('data/names.pkl'):
        names=pickle.load(open('data/names.pkl','rb'))
    else:
        names=[]
    names.extend([curretName] * maxCount)
    pickle.dump(names,open('data/names.pkl','wb'))
    if os.path.exists('/data.faces.pkl'):
        oldFaces=pickle.load(open('data/faces.pkl'),'rb')
        faceData=np.vstack(oldFaces,faceData)
    pickle.dump(faceData,open('data/faces.pkl','wb'))