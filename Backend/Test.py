# import cv2
# url = f"rtsp://admin:pam%4012345@192.168.100.56:554/cam/realmonitor?channel=1&subtype=1"
# cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)
# cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("Failed to read camera")
#         break
#     cv2.imshow("camera", frame)
#     if cv2.waitKey(1) == ord('q'):
#         break


import os
import numpy as np
import onnxruntime as ort

model_path = os.path.expanduser(
    "~/.insightface/models/buffalo_l/det_10g.onnx"
)

print("Model exists:", os.path.exists(model_path))
print("ORT:", ort.__version__)
print("Providers:", ort.get_available_providers())

session = ort.InferenceSession(
    model_path,
    providers=[
        "CUDAExecutionProvider",
        "CPUExecutionProvider"
    ]
)

print("Session providers:", session.get_providers())

input_name = session.get_inputs()[0].name
print("Input:", input_name)

# Test an actual inference
x = np.random.rand(1, 3, 320, 320).astype(np.float32)

try:
    output = session.run(None, {input_name: x})
    print("GPU inference SUCCESS")
    print([o.shape for o in output])

except Exception as e:
    print("GPU inference FAILED")
    print(e)