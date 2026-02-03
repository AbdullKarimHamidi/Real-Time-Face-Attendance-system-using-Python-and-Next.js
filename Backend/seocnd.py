import cv2
import pickle
import os
import json
import numpy as np


face_cascade=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
face_data=[]
face_dir='data/faces'
name_dir='data/names'
os.makedirs(face_dir,exist_ok=True)
os.makedirs(name_dir,exist_ok=True)
face_path=os.path.join(face_dir,'faces.pkl')
namePath=os.path.join(name_dir,'names.pkl')
        

cap=cv2.VideoCapture(0)
name=input("Enter your Name: ")
while True:
    ret,frame=cap.read()
    frame=cv2.flip(frame,1)
    gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    faces=face_cascade.detectMultiScale(gray,1.5,5)
    for (x,y,w,h) in faces:
        image_file=gray[y:y+h,x:x+w]
        image_resize=cv2.resize(image_file,(50,50))
        face_data.append(image_resize.flatten())
        cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
        cv2.putText(frame,f'{name}',(x,y-5),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,255,0),1)
    cv2.imshow('frame',frame)
    key=cv2.waitKey(1) & 0XFF
    if key==ord('q'):
        break
cap.release()
cv2.destroyAllWindows()

FaceData=np.array(face_data)
if os.path.join(namePath):
    with open(namePath,'rb') as f:
        names=pickle.load(f)
else:
    names=[]
names.extend([name] * 100)
with open(namePath,'wb') as f:
    pickle.dump(names,f)
if os.path.exists(face_path):
    with open(face_path,'rb') as f:
        existingFace=pickle.load(f)
    FaceData=np.vstack(existingFace,FaceData)
with open(face_path,'wb') as f:
    pickle.dump(FaceData,f)

       

