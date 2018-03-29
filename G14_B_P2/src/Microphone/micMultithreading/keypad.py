from tkinter import *
from tkinter import ttk
import sys
sys.path.insert(0,r'''C:\Users\Jack\Documents\University\2017-2018\Term 2\CPEN291\G14_B_P2\G14_B_P2\src\Microphone\micWithKeypad''')
from microphone import micRecord
import threading
import builtins
import time


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
_micRecord = micRecord()

class CodeKeypad: 
    #passcode is stored in _strSecret

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
        else:
            print("Error: Incorrect code entered")
        self.clear_num()

    #Helper def to record
    def record():
        _micRecord.recordMessages(_micRecord)

    def record_button(self):
        builtins._recording = not builtins._recording
        #Record audio only if it was not already recording
        time.sleep(0.05)
        if builtins._recording == True:
            #create and start new thread to record
            t1 = threading.Thread(target=micRecord.recordMessages, args=(_micRecord,))
            t1.start()

    def play_button(self):
        builtins._recording = False
        #To ensure the message is finished recording before playing
        time.sleep(0.05)
        #create and start new thread to playback audio
        t2 = threading.Thread(target=micRecord.playMessages, args=(_micRecord,))
        t2.start()

    def __init__(self,root):
        #Variable holding the changing value stored in entry 
        self.entry_value = StringVar(root, value="")
        #customizing the windows
        root.geometry("555x300")
        root.resizable(width=FALSE,height=FALSE)
        root.title("Keypad")

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

        self.recordButton = ttk.Button(root,text="Record/Stop",command=lambda:self.record_button())
        self.recordButton.grid(row = 5, column = 1, columnspan = 3, sticky=E)

        self.playButton = ttk.Button(root,text="Playback",command=lambda:self.play_button())
        self.playButton.grid(row = 5, column = 4, columnspan = 3)

root = Tk()
keyp = CodeKeypad(root)
root.mainloop()
