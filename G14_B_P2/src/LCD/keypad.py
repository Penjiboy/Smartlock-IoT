from tkinter import *
from tkinter import ttk
import time

root = Tk()

#passcode is stored in _strSecret
_strSecret = "1809"
_strVar = ""

def put_num1(event):
    userEntry.insert("end",1)
    global _strVar
    _strVar = _strVar + '1'

def put_num2(event):
    userEntry.insert("end",2)
    global _strVar
    _strVar = _strVar +'2'

def put_num3(event):
    userEntry.insert("end",3)
    global _strVar
    _strVar = _strVar +'3'

def put_num4(event):
    userEntry.insert("end",4)
    global _strVar
    _strVar = _strVar +'4'

def put_num5(event):
    userEntry.insert("end",5)
    global _strVar
    _strVar = _strVar +'5'

def put_num6(event):
    userEntry.insert("end",6)
    global _strVar
    _strVar = _strVar +'6'

def put_num7(event):
    userEntry.insert("end",7)
    global _strVar
    _strVar = _strVar + '7'

def put_num8(event):
    userEntry.insert("end",8)
    global _strVar
    _strVar = _strVar + '8'

def put_num9(event):
    userEntry.insert("end",9)
    global _strVar
    _strVar = _strVar + '9'

def put_num0(event):
    userEntry.insert("end",0)
    global _strVar
    _strVar = _strVar + '0'  

def clear_num(event):
    userEntry.delete(0,"end")
    global _strVar
    _strVar = "" #reset the _strVar 

def enter_code(event):
    userEntry.insert("end","ENTERED")
    global _strVar
    global _strSecret
    print("Code entered: ", _strVar)
    if _strVar == _strSecret:
        print("Door is unlocked")
    else:
        print("Error: Incorrect code entered")
    clear_num(NONE)

root.geometry("120x120+20+20")
userEntry = Entry(root,width=20)
userEntry.grid(row = 0, columnspan = 7)

num1Button = Button(root,text="1")
num1Button.bind("<Button-1>",put_num1)
num1Button.grid(row = 1,columnspan = 3 , sticky=E)

num2Button = Button(root,text="2")
num2Button.bind("<Button-1>",put_num2)
num2Button.grid(row = 1, column = 3)

num3Button = Button(root,text="3")
num3Button.bind("<Button-1>",put_num3)
num3Button.grid(row = 1, column = 4, columnspan = 2 , sticky=W)

num4Button = Button(root,text="4")
num4Button.bind("<Button-1>",put_num4)
num4Button.grid(row = 2, columnspan = 3 , sticky=E)

num5Button = Button(root,text="5")
num5Button.bind("<Button-1>",put_num5)
num5Button.grid(row = 2, column = 3)

num6Button = Button(root,text="6")
num6Button.bind("<Button-1>",put_num6)
num6Button.grid(row = 2, column = 4, columnspan = 2 , sticky=W)

num7Button = Button(root,text="7")
num7Button.bind("<Button-1>",put_num7)
num7Button.grid(row = 3, columnspan = 3 , sticky=E)

num8Button = Button(root,text="8")
num8Button.bind("<Button-1>",put_num8)
num8Button.grid(row = 3, column = 3)

num9Button = Button(root,text="9")
num9Button.bind("<Button-1>",put_num9)
num9Button.grid(row = 3, column = 4, columnspan = 2 , sticky=W)

num0Button = Button(root,text="0")
num0Button.bind("<Button-1>",put_num0)
num0Button.grid(row = 4, column = 3)

clearButton = Button(root,text="Clear")
clearButton.bind("<Button-1>",clear_num)
clearButton.grid(row = 4, columnspan = 3, sticky=E)

enterButton = Button(root,text="Enter")
enterButton.bind("<Button-1>",enter_code)
enterButton.grid(row = 4, column = 4, columnspan = 3, sticky=W)

root.mainloop()