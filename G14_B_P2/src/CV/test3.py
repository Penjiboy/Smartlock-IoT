from tkinter import *
from tkinter import ttk
import RPi.GPIO as GPIO
import time
import threading
import face_recognition
import picamera
import numpy as np
import pickle
from socketIO_client_nexus import SocketIO, LoggingNamespace
from microphone import micRecord
import pysftp

training = False
all_face_encodings = {}
sftp =  pysftp.Connection('38.88.74.79', username='lock', password='calmdown!')
Sock = SocketIO('38.88.74.79', 80)
cam = picamera.PiCamera()
cam.resolution = (320, 240)
output = np.empty((240, 320, 3), dtype=np.uint8)
encode = np.empty((240, 320, 3), dtype=np.uint8)

GPIO.setmode(GPIO.BCM)
GPIO.setup(12, GPIO.OUT)
pwm = GPIO.PWM(12, 100)
pwm.start(float(85)/10.0+2.5)

def unlock():
        duty = float(185)/10.0+2.5
        pwm.ChangeDutyCycle(duty)
        print("door unlocked")
def lock():
        duty = float(85)/10.0+2.5
        pwm.ChangeDutyCycle(duty)
        print("door locked")



print("Loading known face image(s)")
ali_image = face_recognition.load_image_file("images/ali.jpg")
all_face_encodings["Ali"] = face_recognition.face_encodings(ali_image)[0]


with open('dataset_faces.dat', 'wb') as f:
        pickle.dump(all_face_encodings, f)


with open('dataset_faces.dat', 'rb') as f:
        all_face_encodings = pickle.load(f)

print("break")


# Initialize some variables
face_locations = []
face_encodings = []

def status(*args):
    if args[0]==1 : lock()
    elif args[0]==0: unlock()
    else: print("error")

class StoreCode: 
    def __init__(self):
        #passcode is stored in private variable which cannot be accessed outside of StoreCode 
        #so this way we can create functions that can modify __strSecret privately
        #iff a keycode/special password is entered 
        self.__strSecret = "567890"
    
    def checkEqual(self,value):
        return value==self.__strSecret


passCode = StoreCode()
_strVar = ""  
time=time.time()
_micRecord = micRecord()
_isRecording = False

class CodeKeypad: 

    #insert the number 
    def button_press(self,value):
        entry_value = self.entry_value.get() 
        
        entry_value += '* '
        #_strVar is for future if we want to insert **** instead of 
        #inserting numbers into our entry box to hide the passcode  
        global _strVar
        _strVar += value 
        
        self.userEntry.delete(0,"end")

        self.userEntry.insert(0,entry_value)

    def clear_num(self):
        self.userEntry.delete(0,"end")
        global _strVar
        _strVar = "" #reset the _strVar 		

    def enter_code(self):
        global _strVar
        global passCode
        print("Code entered: ", _strVar)
        if passCode.checkEqual(_strVar):
            print("Door is unlocked")
            unlock()
        else:
            lock()
            print("Error: Incorrect code entered")
        self.clear_num()

    def record_button(self):
        global _isRecording
        if (_isRecording) == False:
            _isRecording = True
            t1 = threading.Thread(target=micRecord.recordOn, args=(_micRecord,))
            t1.start()
        else:
            _isRecording = False
            _micRecord.recordStop()

    def __init__(self,root):
        #Variable holding the changing value stored in entry 
        self.entry_value = StringVar(root, value="")
        #customizing the windows
        root.geometry("555x300")
        root.resizable(width=FALSE,height=FALSE)
        root.title("Keypad")
        #end = time.time()
        #if end-start>10:
	  #  lock()
        Style=ttk.Style()
        Style.configure("TButton",
                        font="Times 20 bold",
                        padding=10)

        #Entry and buttons 
        self.userEntry = ttk.Entry(root, font=('Times',20,'bold'),textvariable=self.entry_value ,width=35)
        self.userEntry.grid(row = 0, column = 1, columnspan = 9)

        self.num1Button = ttk.Button(root,text="1",command=lambda:self.button_press('1'))
        self.num1Button.grid(row = 1, column =1, columnspan = 3 , sticky=E)

        self.num2Button = ttk.Button(root,text="2",command=lambda:self.button_press('2'))
        self.num2Button.grid(row = 1, column = 4, columnspan=3)

        self.num3Button = ttk.Button(root,text="3",command=lambda:self.button_press('3'))
        self.num3Button.grid(row = 1, column = 7, columnspan = 3 , sticky=W)

        self.num4Button = ttk.Button(root,text="4",command=lambda:self.button_press('4'))
        self.num4Button.grid(row = 2, column = 1, columnspan = 3 , sticky=E)

        self.num5Button = ttk.Button(root,text="5",command=lambda:self.button_press('5'))
        self.num5Button.grid(row = 2, column = 4, columnspan=3)

        self.num6Button = ttk.Button(root,text="6",command=lambda:self.button_press('6'))
        self.num6Button.grid(row = 2, column = 7, columnspan = 3 , sticky=W)

        self.num7Button = ttk.Button(root,text="7",command=lambda:self.button_press('7'))
        self.num7Button.grid(row = 3, column = 1,columnspan = 3 , sticky=E)

        self.num8Button = ttk.Button(root,text="8",command=lambda:self.button_press('8'))
        self.num8Button.grid(row = 3, column = 4, columnspan=3)

        self.num9Button = ttk.Button(root,text="9",command=lambda:self.button_press('9'))
        self.num9Button.grid(row = 3, column = 7, columnspan = 3, sticky=W)

        self.num0Button = ttk.Button(root,text="0",command=lambda:self.button_press('0'))
        self.num0Button.grid(row = 4, column = 4, columnspan=3)

        self.clearButton = ttk.Button(root,text="Clear",command=lambda:self.clear_num())
        self.clearButton.grid(row = 4, column = 1, columnspan = 3, sticky=E)

        self.enterButton = ttk.Button(root,text="Enter",command=lambda:self.enter_code())
        self.enterButton.grid(row = 4, column = 7, columnspan = 3, sticky=W)

        self.recordButton = ttk.Button(root,text="Record/ Stop",command=lambda:self.record_button())
        self.recordButton.grid(row = 5, column = 3, columnspan = 5)



def train():
    
    training = True
    name = "ali"
    print("recognizing" + name+ "\n")
    cam.capture(encode,format="rgb")
    while(len(face_recognition.face_encodings(encode)) == 0 or len(face_recognition.face_encodings(encode)) > 1):
        cam.capture(encode,format="rgb")
        print("try again")
    all_face_encodings[name] = face_recognition.face_encodings(encode)[0]
    with open('dataset_faces.dat', 'wb') as f:
        pickle.dump(all_face_encodings, f)
        all_face_encodings = pickle.load(f)
    training = False
    

class camera( threading.Thread ):
    def run(self):
        while training == False:

            face_names = list(all_face_encodings.keys())
            face_encodings = np.array(list(all_face_encodings.values()))

            print("Capturing image.")
            # Grab a single frame of video from the RPi camera as a numpy array
            cam.capture(output,format="rgb")
            cam.capture("last_user.png")

            # Find all the faces and face encodings in the current frame of video
            #face_locations = face_recognition.face_locations(output)
            #print("Found {} faces in image.".format(len(face_locations)))
            #face_encodings = face_recognition.face_encodings(output, face_locations)

            # Loop over each face found in the frame to see if it's someone we know.
            unknown_face = face_recognition.face_encodings(output)
            result = face_recognition.compare_faces(face_encodings, unknown_face)

            # Print the result as a list of names with True/False
            names_with_result = list(zip(face_names, result))
            print(names_with_result)
'''
            for face_encoding in face_encodings:
                # See if the face is a match for the known face(s)
                match = face_recognition.compare_faces([ali_face_encoding], face_encoding)
                name = "<Unknown Person>"

                if match[0]:
                    name = "Ali"
                    sftp.cd("last")
                    sftp.put("last_user.png")
                    sftp.cd("..")
                    Sock.emit("unlock",name)
                    
                    unlock()
                else: lock()
                
                print("I see someone named {}!".format(name))
        '''

class receiver ( threading.Thread ):
      def run ( self ):
        while True:
           Sock.on("lockChanged",status)
           Sock.on("train",train)
           Sock.wait(seconds = 1)

class ui(threading.Thread):
    def run(self):
        root = Tk()
        def on_closing():
                root.destroy()
        keyp = CodeKeypad(root)
        root.geometry("800x480+0+0")
        root.protocol("WM_DELETE_WINDOW",on_closing)
        #root.attributes('-fullscreen',True)
        root.mainloop()
        

train()           

receiverThread = receiver()
receiverThread.start()

cameraThread = camera()
cameraThread.start()
 
uiThread = ui()
uiThread.start()
