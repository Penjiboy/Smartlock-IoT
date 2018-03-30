from socketIO_client_nexus import SocketIO, LoggingNamespace

def response():
    print("response received\n")

S = SocketIO('localhost',8080)
S.emit('unlock')
#S.on("bbb", response)
S.wait(seconds=1)

