

import face_recognition
import picamera
import numpy as np
from socketIO_client_nexus import SocketIO, LoggingNamespace

Sock = SocketIO('38.88.74.79', 80)
camera = picamera.PiCamera()
camera.resolution = (320, 240)
output = np.empty((240, 320, 3), dtype=np.uint8)

print("Loading known face image(s)")
ali_image = face_recognition.load_image_file("ali.jpg")
ali_face_encoding = face_recognition.face_encodings(ali_image)[0]

# Initialize some variables
face_locations = []
face_encodings = []

while True:
    print("Capturing image.")
    # Grab a single frame of video from the RPi camera as a numpy array
    camera.capture(output,format="rgb")
    camera.capture("last_user.jpg")

    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(output)
    print("Found {} faces in image.".format(len(face_locations)))
    face_encodings = face_recognition.face_encodings(output, face_locations)

    # Loop over each face found in the frame to see if it's someone we know.
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        match = face_recognition.compare_faces([ali_face_encoding], face_encoding)
        name = "<Unknown Person>"

        if match[0]:
            name = "Ali"
            sock.emit("Recognized",name)

        print("I see someone named {}!".format(name))



