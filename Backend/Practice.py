import cv2
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware


cameras = {
    "herat": 0,
    "kabul": 1,
    "mazar": 2
}
caps={}
for name, index in cameras.items():
    cap = cv2.VideoCapture(index)
    if cap.isOpened():
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        caps[name] = cap
    else:
        print(f"❌ Camera {name} not available")

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def generate_frames(camera_name: str):
    cap = caps.get(camera_name)
    if cap is None:
        return
    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        frame = cv2.flip(frame, 1)

        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame_bytes
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
