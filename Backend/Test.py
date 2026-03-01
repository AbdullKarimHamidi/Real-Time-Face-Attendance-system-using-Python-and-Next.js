import cv2

rtsp_url = "rtsp://admin:D@iNas0r@192.168.100.51:554/cam/realmonitor?channel=1&subtype=0"

cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)

# Force buffer & latency settings (important)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

if not cap.isOpened():
    print("❌ Failed to open RTSP stream")
    exit()

print("✅ RTSP stream opened")

while True:
    ret, frame = cap.read()

    if not ret:
        print("⚠️ Frame not received")
        continue

    cv2.imshow("IP Camera Test", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()