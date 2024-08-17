import os
import pickle
import cv2
import face_recognition
import cvzone
import numpy as np
import requests

# API Endpoints and credentials
url = "http://localhost:8000/api/user/login/"
password = "Changeme@123"
login = "http://localhost:8000/api/student/attendance/"

# Set to keep track of already processed roll numbers
roll = set()

def dataGet(rol):
    if rol in roll:
        res = requests.get(f"http://192.168.158.239:80/get?message=Already marked")
        print(res)
        return
    roll.add(rol)
    data = {
        "id": str(rol),
        "user_type": "student",
        "password": password
    }

    response = requests.post(url, json=data)
    token = response.json().get('token')
    if not token:
        print(f"Failed to get token for {rol}")
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    data = {
        "rollno": rol
    }
    res = requests.get(f"http://192.168.158.239:80/get?message={rol}")
    print(res)
    response = requests.post(login, json=data, headers=headers)
    if response.status_code == 400:
        print(f"Already marked attendance for {rol}")
        return

# Load the encoding file
print("Loading Encode File ...")
file = open('EncodeFile.p', 'rb')
encodeListKnownWithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownWithIds
print("Encode File Loaded")

# Load the image
image_path = 'file.jpg'  # Replace with the path to your image
img = cv2.imread(image_path)

# Check if the image was loaded correctly
if img is None:
    print(f"Error: Unable to load image at path: {image_path}")
    exit()

# Resize the image for faster processing
imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

# Find all face locations and encodings
faceCurFrame = face_recognition.face_locations(imgS)
encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

if faceCurFrame:
    for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            y1, x2, y2, x1 = faceLoc
            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
            bbox = x1, y1, x2 - x1, y2 - y1
            img = cvzone.cornerRect(img, bbox, rt=0)
            roll_no = studentIds[matchIndex]
            print(roll_no)
            cv2.putText(img, roll_no, (x1 + 50, y2 + 50), 1, 4, (255, 0, 255), 4)

            # Call dataGet function for each detected face
            # dataGet(roll_no)

# Resize the image to fit within the screen dimensions
screen_res = 1280, 720  # Set the screen resolution to fit within this size
img_height, img_width, _ = img.shape

# Calculate the scaling factor
scale_width = screen_res[0] / img_width
scale_height = screen_res[1] / img_height
scale = min(scale_width, scale_height)

# Calculate new dimensions
new_width = int(img_width * scale)
new_height = int(img_height * scale)

# Resize the image
resized_img = cv2.resize(img, (new_width, new_height))

# Show the image with detected faces
cv2.imshow("Face Attendance", resized_img)
cv2.waitKey(0)  # Wait for a key press to close the window
cv2.destroyAllWindows()
