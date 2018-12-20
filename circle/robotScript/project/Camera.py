from picamera import PiCamera
from picamera.array import PiRGBArray
from PIL import Image
from pyzbar.pyzbar import decode
import numpy as np
#import cv2

class Camera():
    #
    def __init__(self, resolution=(640, 480), framerate=32):
        self.camera = PiCamera()
        self.camera.resolution = resolution
        self.camera.framerate = framerate
        self.rawCapture = PiRGBArray(self.camera, size=self.camera.resolution)
    
    #
    def start(self):
        self.camera.start_preview()
    #
    def close(self):
        self.camera.stop_preview()

    #
    def getQRCodeData(self):
        for frame in self.camera.capture_continuous(self.rawCapture, format="rgb", use_video_port=True):
            image = frame.array

            d = decode(image)
            if d:
                print (d[0].data)
                self.rawCapture.truncate(0)
                return (int)(d[0].data)
            break

        self.rawCapture.truncate(0)
        return
    
    # 
    def showCameraMonitor(self, time=5):
        camera.start_preview()
        sleep(time)
        camera.stop_preview()
    
    '''
    #
    def debugForMonitor(self):
        for frame in self.camera.capture_continuous(self.rawCapture, format="rgb", use_video_port=True):
            image = frame.array
            
            cv2.imshow("Frane", image)
            
            d = decode(image)
            if d:
                print (d[0].data)
            
            key = cv2.waitKey(1) & 0xFF
            
            self.rawCapture.truncate(0)
            
            if key == ord('q'):
                break


        cv2.destroyAllWindows()
    '''
    #
    def setResolution(self, resolution=(640, 480)):
        self.camera.resolution = resolution
    
    #
    def setFrame(self, framerate=32):
        self.camera.framerate = framerate