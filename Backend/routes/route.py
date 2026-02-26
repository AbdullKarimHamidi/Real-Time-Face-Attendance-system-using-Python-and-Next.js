from fastapi import FastAPI
from fastapi.responses import StreamingResponse
app=FastAPI()

def ShowAllCamera(function):
    @app.get("/video_feed/{camera_name}")
    def video_feed(camera_name: str):
        return StreamingResponse(
            function(camera_name),
            media_type="multipart/x-mixed-replace; boundary=frame"
            )
