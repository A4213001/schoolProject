import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
class Motor:
    def __init__(self, pin1, pin2):
        self.pin1 = pin1
        self.pin2 = pin2
        GPIO.setup(self.pin1, GPIO.OUT)
        GPIO.setup(self.pin2, GPIO.OUT)
    
    def CW(self):#clockwise
        GPIO.PWM(self.pin1, 50)
        #GPIO.output(self.pin1, GPIO.HIGH)
        #GPIO.output(self.pin2, GPIO.LOW)
    
    def CCW(self):#counter-clockwise
        GPIO.output(self.pin1, GPIO.LOW)
        GPIO.output(self.pin2, GPIO.HIGH)
    
    def stop(self):#stop motor
        GPIO.output(self.pin1, GPIO.LOW)
        GPIO.output(self.pin2, GPIO.LOW)
    def end(self):
        GPIO.cleanup()
        
m = Motor(4,17)