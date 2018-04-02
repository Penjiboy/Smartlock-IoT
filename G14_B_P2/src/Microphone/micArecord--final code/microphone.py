import os
import subprocess
import time

fileName = "myMessage.wav"

class micRecord:
    def recordOn(self):
        #start recording message
        print("starting to record message. Max duration: 1 minute")
        subprocess.call(["arecord", "-f", "S16_LE","-r", "48000", "-D", "plughw:1,0", "-d", "60", fileName])
    
    def recordStop(self):
        subprocess.call(["pkill", "-f", "arecord"])
        print("message recorded and saved")
        time.sleep(0.5)
        os.system("sendRecording.sh")
        print("recording sent over to the remote server")

