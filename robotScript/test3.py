import RPi.GPIO as GPIO
import time
import os

GPIO.setmode(GPIO.BCM)

M_PIN1 = 4
M_PIN2 = 17 

os.system('sudo pigpiod')
cmd = 'pigs s '

def M_CW(PIN):
    os.system(cmd + str(PIN) + ' ' + str(2000))
    
def M_CCW(PIN):
    os.system(cmd + str(PIN) + ' ' + str(1000))
    
def M_STOP(PIN):
    os.system(cmd + str(PIN) + ' ' + str(1500))
    
def GO():
    print('GO')
    M_CCW(M_PIN1)
    M_CW(M_PIN2)
    
def BACK():
    print('BACK')
    M_CW(M_PIN1)
    M_CCW(M_PIN2)
    
def CW():
    print('CW')
    M_CW(M_PIN1)
    M_CW(M_PIN2) 
    
def CCW():
    print('CCW')
    M_CCW(M_PIN1)
    M_CCW(M_PIN2)
    
def STOP():
    print('STOP')
    M_STOP(M_PIN1)
    M_STOP(M_PIN2)

#while 1:
    #CW()
    #time.sleep(0.375)
    #STOP()
    #BACK()
    #time.sleep(0.002)
    #STOP()
    #time.sleep(0.1)



#20181101 UPDATA
#By Pzh

def main():
    BACK()
    time.sleep(1)
    STOP()
    time.sleep(1)
    BACK()
    time.sleep(1)
    STOP()

if __name__ == "__main__":
    main()

