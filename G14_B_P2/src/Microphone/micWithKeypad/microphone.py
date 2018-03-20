#Referenced from https://people.csail.mit.edu/hubert/pyaudio/

import os
#import pyaudio
#import wave
import subprocess
import time

CHUNK_SIZE = 1024
#FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_Time = 5
WAVE_OUTPUT_FILENAME = "myMessage.wav"

class micRecord:

    #record message as long as the button is pressed down
#    def recordMessage1():
        #delete old message before trying to record another message
    #    os.system("rm myMessage.wav")
#        subprocess.call(["rm", WAVE_OUTPUT_FILENAME])

#        p = pyaudio.PyAudio()

#        stream = p.open(format=FORMAT,
#                        channels=CHANNELS,
#                        rate=RATE,
#                        input=True,
#                        frames_per_buffer=CHUNK)

#        frames = []

    #   for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    #       data = stream.read(CHUNK)
    #       frames.append(data)

#        while _recording:
#            data = stream.read(CHUNK_SIZE)
#            frames.append(data)

#        print("Message recorded")

#        stream.stop_stream()
#        stream.close()
#        p.terminate()

#        wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
#        wf.setnchannels(CHANNELS)
#        wf.setsampwidth(p.get_sample_size(FORMAT))
#        wf.setframerate(RATE)
#        wf.writeframes(b''.join(frames))
#        wf.close()




    #play back recorded message
#    def playMessage1():
#        wf = wave.open("myMessage", 'rb')

#        p = pyaudio.PyAudio()

#        stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
#                        channels=wf.getnchannels(),
#                        rate=wf.getframerate(),
#                        output=True)

#        data = wf.readframes(CHUNK_SIZE)

#        while data != '':
#            stream.write(data)
#            data = wf.readframes(CHUNK_SIZE)

#        stream.stop_stream()
#        stream.close()
#        p.terminate()

    def recordMessage2():
        print("actually recording!")
        sleep(5)

    def playMessage2():
        print("playing back la la la")
        sleep(5)


#    def main():
#        keep recording
#        while True:
#            if _strVar = _strRecord:
#                recordMessage()
#                sleep(2)
#                playMessage()


#    if __name__ == '__main__':
#            main()

