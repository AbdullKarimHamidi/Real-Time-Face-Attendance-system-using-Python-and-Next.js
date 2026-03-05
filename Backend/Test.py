import torch
import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis
print(f"Is CUDA available for Torch? {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"Running on: {torch.cuda.get_device_name(0)}")
options = {
    'device_id': 0,
    'cudnn_conv_algo_search': 'DEFAULT',
    'arena_extend_strategy': 'kSameAsRequested'
}
app = FaceAnalysis(name='buffalo_s', providers=[('CUDAExecutionProvider', options), 'CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(320, 320))

img = cv2.imread("face2.jpg")
if img is not None:
    img = cv2.resize(img, (640, 480))
    faces = app.get(img)
    print(f"Detected {len(faces)} faces.")
    res_img = app.draw_on(img, faces)
    cv2.imshow("940MX GPU Result", res_img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
else:
    print("Error: Image not found.")