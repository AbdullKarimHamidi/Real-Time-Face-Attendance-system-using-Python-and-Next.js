import cv2
import numpy as np

image = np.zeros((480, 640, 3), dtype=np.uint8)

while True:
    # cv2.line(image,(50,50),(240,50),(0,255,0),2)
    # cv2.line(image,(50,50),(50,240),(0,255,0),2)
    # cv2.line(image,(50,240),(240,240),(0,255,0),2)
    # cv2.line(image,(240,240),(240,50),(0,255,0),2)

    cv2.line(image,(100,100),(20,100),(0,255,0),2)
    cv2.line(image,(100,100),(100,20),(0,255,0),2)
    cv2.line(image,(100,200),(20,100),(0,255,0),2)


    cv2.imshow("frame", image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()
