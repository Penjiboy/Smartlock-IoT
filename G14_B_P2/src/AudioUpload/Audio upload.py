from ftplib import FTP

host = '38.88.74.79'
username = 'alexC'
password = 'calmdown!'
file = '*.wav'

f = ftplib.FTP(host)
f.login(username,password)

pwd_path = f.pwd()

def UploadFile()
   remote_file = 'Audio.wav'
   local_file = 'pi/Documents/G14_B_P2/G14_B_P2/Audio.wav'
   bufSize = 1024
   fp = open(local_file,'rb')
   f.storbinary('STOR ' + remote_file, fp, bufSize)
   fp.close()

UploadFile()
f.quit()

