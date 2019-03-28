import Hardware
import time

class Wheels:
    def __init__(self, pinLeft, pinRight):
        self.left = Hardware.SG90(pinLeft)
        self.right = Hardware.SG90(pinRight)

    def speed(self, goDelay = 0, stopDelay = 0):
        time.sleep(goDelay / 1000)
        if(stopDelay):
            self.stop()
            time.sleep(stopDelay / 1000)
            
    def go(self, goDelay = 0, stopDelay = 0):
        print("wheels go")
        self.left.cw()
        self.right.ccw()
        self.speed(goDelay, stopDelay)
    
    def stop(self):
        print("wheels stop")
        self.left.stop()
        self.right.stop()
    
    def cw(self, goDelay = 0, stopDelay = 0):
        print("wheels cw")
        self.left.cw()
        self.right.cw()
        self.speed(goDelay, stopDelay)
        
    def cwStop(self, goDelay = 0, stopDelay = 0):
        print("wheels cwStop")
        self.left.cw()
        self.right.stop()
        self.speed(goDelay, stopDelay)
    
    def ccw(self, goDelay = 0, stopDelay = 0):
        print("wheels ccw")
        self.left.ccw()
        self.right.ccw()
        self.speed(goDelay, stopDelay)
        
    def ccwStop(self, goDelay = 0, stopDelay = 0):
        print("wheels ccwStop")
        self.left.stop()
        self.right.ccw()
        self.speed(goDelay, stopDelay)
    
    
class CNY70Encode:
    def __init__(self, pinLeft, pinMid, pinRight):
        self.left = Hardware.CNY70(pinLeft)
        self.mid = Hardware.CNY70(pinMid)
        self.right = Hardware.CNY70(pinRight)
        self.data = 0
        self.dataLast = 0
    
    def updateData(self):
        self.data = (self.left.getData() << 0) + \
                (self.mid.getData() << 1) + \
                (self.right.getData() << 2)
        if self.data != lastData :
            lastData = data
        return data