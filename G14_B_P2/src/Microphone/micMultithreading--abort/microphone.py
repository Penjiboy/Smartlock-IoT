#Referenced from https://people.csail.mit.edu/hubert/pyaudio/
import builtins
import os
import pyaudio
import wave
import subprocess

CHUNK_SIZE = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
FILENAME = "myMessage.wav"

#Global varible to determine if it should continue recording
builtins._recording = False

class micRecord:

    #record message as long as the button is pressed down
    def recordMessages(self):

        p = pyaudio.PyAudio()

        stream = p.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK_SIZE)

        print("Now recording message: ")

        frames = []

        while _recording:
            data = stream.read(CHUNK_SIZE)
            frames.append(data)

        print("Message recorded")

        stream.stop_stream()
        stream.close()
        p.terminate()

        wf = wave.open(FILENAME, 'wb')
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
        wf.close()

    #play back recorded message
    def playMessages(self):
        wf = wave.open(FILENAME, 'rb')

        p = pyaudio.PyAudio()

        stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                        channels=wf.getnchannels(),
                        rate=wf.getframerate(),
                        output=True)

        data = wf.readframes(CHUNK_SIZE)

        count = 0
        print("playing back audio")
        while (len(data) > 0) and not(builtins._recording == True):
            stream.write(data)
            data = wf.readframes(CHUNK_SIZE)

        print("finished playback")
        stream.stop_stream()
        stream.close()
        p.terminate()
