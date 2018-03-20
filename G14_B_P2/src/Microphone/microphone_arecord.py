import os
import RPi.GPIO as GPIO
import subprocess

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)
fileName = "myMessage.txt"

#input_state = GPIO.input(18)

def recordOn():
    #start recording message
#    os.system("arecord -D plughw:1,0 10 myMessage.wav")
    subprocess.call(["arecord", "-D", "plughw:1,0", "10", fileName])




def main():
    print("Recording message, duration: 10seconds")
    #record message for 10 seconds
    recordOn()
    
    sleep(1)
    print("Message recorded, playing back")
#    os.system("aplay myMessage.wav")
    subprocess.call(["aplay", fileName])



if __name__ == '__main__':
    while True:
        #wait for interrupt of button
        GPIO.wait_for_edge(18, GPIO.FALLING)
        main()
