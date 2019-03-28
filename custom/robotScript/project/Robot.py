import Module
import time
import Camera

class Robot:
    def __init__(self,
                 wheelsLeftPin            = 23,\
                 wheelsRightPin           = 24,\
                 CNY70EncodeMidPinLeft    = 17,\
                 CNY70EncodeMidPinMid     = 27,\
                 CNY70EncodeMidPinRight   = 22,\
                 CNY70EncodeLeftPinLeft   = 5,\
                 CNY70EncodeLeftPinMid    = 6,\
                 CNY70EncodeLeftPinRight  = 13,\
                 CNY70EncodeRightPinLeft  = 16,\
                 CNY70EncodeRightPinMid   = 20,\
                 CNY70EncodeRightPinRight = 21):
        self.wheels = Module.Wheels(wheelsLeftPin, wheelsRightPin)
        self.encodeMid = Module.CNY70Encode(CNY70EncodeMidPinLeft, CNY70EncodeMidPinMid, CNY70EncodeMidPinRight)
        self.encodeLeft = Module.CNY70Encode(CNY70EncodeLeftPinLeft, CNY70EncodeLeftPinMid, CNY70EncodeLeftPinRight)
        self.encodeRight = Module.CNY70Encode(CNY70EncodeRightPinLeft, CNY70EncodeRightPinMid, CNY70EncodeRightPinRight)
        #self.camera = Camera.Camera()

