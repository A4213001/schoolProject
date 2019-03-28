import RPi.GPIO as GPIO
import os
GPIO.setmode(GPIO.BCM)
os.system('sudo pigpiod')

class SG90:
    def __init__(self, pin):
        self.cmd = 'pigs s '
        self.pin = pin
    
    def cw(self):
        os.system(self.cmd + str(self.pin) + ' ' + str(2000))
    
    def ccw(self):
        os.system(self.cmd + str(self.pin) + ' ' + str(1000))
        
    def stop(self):
        os.system(self.cmd + str(self.pin) + ' ' + str(1500))
        
        
class CNY70:
    def __init__(self, pin):
        self.pin = pin
        GPIO.setup(self.pin, GPIO.IN)
        
    def getData(self):
        #print("PIN: " + str(self._pin) +" Data: " + str(GPIO.input(self._pin)))
        return (int)(GPIO.input(self.pin) == True)