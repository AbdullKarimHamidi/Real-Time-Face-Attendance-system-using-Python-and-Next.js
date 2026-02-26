from database.db import cameras_collection

cameras = list(cameras_collection.find())

full_address = []   
camindex = {}      

for index, cam in enumerate(cameras):
    cam_name = cam.get("camera_name")
    username = cam.get("username")
    password = cam.get("password")
    ipaddress = cam.get("ipaddress")
    rtsp_url = f"rtsp://{username}:{password}@{ipaddress}"

    full_address.append(rtsp_url)
    camindex[cam_name] = rtsp_url
