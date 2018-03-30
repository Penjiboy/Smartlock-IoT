import RPi.GPIO as GPIO
import time


GPIO.setmode(GPIO.BCM)
GPIO.setup(12, GPIO.OUT)
pwm = GPIO.PWM(12, 100)
pwm.start(float(85)/10.0+2.5)

from socketIO_client_nexus import SocketIO, LoggingNamespace

Sock = SocketIO('38.88.74.79', 80)

def unlock():
        duty = float(185)/10.0+2.5
        pwm.ChangeDutyCycle(duty)
        #start = time.time()
        print("door unlocked")
def lock():
        duty = float(85)/10.0+2.5
        pwm.ChangeDutyCycle(duty)
        print("door locked")

def status(*args):
    if args[0]==1 : lock()
    elif args[0]==0: unlock()
    else: print("error")

while True:
    #print("waiting\n")
    Sock.on("lockChanged",status)
    Sock.wait(seconds = 1)
    

    
