import os
import time


    def main():
        os.system("sudo apt-get install python-pyaudio python3-pyaudio")
        sleep(10)
        os.system("sudo modprobe snd_bcm2835")
        sleep(5)
        os.system("arecord -D plughw:1,0 10 test.wav")
        sleep(10)
        os.system("aplay test.wav")

    if __name__ == '__main__':
        main()

