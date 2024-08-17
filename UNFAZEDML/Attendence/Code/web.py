import os
import pickle
import cv2
import face_recognition
import cvzone
import numpy as np
import requests
import time  # Import time module

url = "http://192.168.43.96:8000/api/user/login/"
password = "Changeme@123"
login = "http://192.168.43.96:8000/api/student/attendance/"

roll = set()
token = ""

def dataGet(rol):
    global token
    if rol in roll:
        print(f"Already marked attendance for {rol}")
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
          "rollno": rol,
          "year" : 2,
          "department": "AIDS",
          "section": "A"
    }
    requests.post(login, json=data, headers=headers)

# Initialize webcam
cap = cv2.VideoCapture(0)

# Set the webcam resolution to the maximum available
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

# Load the encoding file
print("Loading Encode File ...")
file = open('EncodeFile.p', 'rb')
encodeListKnownWithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownWithIds
print("Encode File Loaded")

# Record start time
start_time = time.time()

while True:
    success, img = cap.read()

    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

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
                cv2.putText(img, roll_no, (x1 + 50, y2 + 50), 1, 2, (255, 0, 255), 2)

                # Call dataGet function for each detected face
                dataGet(roll_no)

    cv2.imshow("Face Attendance", img)
    cv2.waitKey(1)

    # Check if 2 minutes have passed
    if time.time() - start_time > 30:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        data = {
            "year": 2,
            "department": "AIDS",
            "section": "A"
        }
        print("2 minutes have passed. Exiting...")
        requests.post("http://192.168.43.96:8000/api/student/attendance/absent/", json=data, headers=headers)
        break

# Release the webcam and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
