import os
import subprocess
import time
import urllib.request, urllib.parse

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
        os.system("./sendRecording.sh")
        print("recording sent over to the remote server")
#        data = {
#        'visitor' : 'true',
#        'message' : 'true',
#        'intruderWarning' : 'false',
#        'lockID' : 'lock1'
#        }
#        data = bytes( urllib.parse.urlencode( data ).encode() )
#        handler = urllib.request.urlopen( 'http://38.88.74.79:9015/userRecording', data )

