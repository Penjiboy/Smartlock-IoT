import os
import subprocess

fileName = "myMessage.wav"

class micRecord:
    def recordOn(self):
        #start recording message
        print("starting to record message. Max duration: 1 minute")
        subprocess.call(["arecord", "-f", "S16_LE","-r", "48000", "-D", "plughw:1,0", "-d", "60", fileName])
    
    def recordStop(self):
        subprocess.call(["pkill", "-f", "arecord"])
        print("message recorded and saved")

