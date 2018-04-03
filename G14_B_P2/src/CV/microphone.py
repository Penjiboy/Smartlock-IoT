import os
import subprocess
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import pysftp

fileName = "myMessage.wav"
sftp =  pysftp.Connection('38.88.74.79', username='root', password='291#jHjRed26H')

class micRecord:
    def recordOn(self):
        #start recording message
        print("starting to record message. Max duration: 1 minute")
        subprocess.call(["arecord", "-f", "S16_LE","-r", "48000", "-D", "plughw:1,0", "-d", "60", fileName])
    
    def recordStop(self):
        subprocess.call(["pkill", "-f", "arecord"])
        print("message recorded and saved")
        time.sleep(0.5)
#        os.system("./sendRecording.sh")

        sftp.chdir("G14_B_P2/G14_B_P2/src/web/mic/lock1")
        sftp.put("myMessage.wav")
        
        
        print("recording sent over to the remote server")


