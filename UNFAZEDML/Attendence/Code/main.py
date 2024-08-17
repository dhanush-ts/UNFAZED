import os
import pickle
import cv2
import face_recognition
import cvzone
import numpy as np
import requests
import sys

url = "http://localhost:8000/api/user/login/"
password = "Changeme@123"
login = "http://localhost:8000/api/student/attendance/"

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

    token = response.json()['token']

    headers = {
        "Authorization": f"Bearer {token}",  # Replace with your actual token
        "Content-Type": "application/json"
    }

    # print(headers)

    data = {
        "rollno": rol
    }
    res = requests.get(f"http://192.168.158.239:80/get?message={rol}")
    print(res)
    response = requests.post(login, json=data , headers=headers)
    if response.status_code==400:
        print("Already marked attendece")
        return


cap = cv2.VideoCapture(0)
cap.set(3, 640)
cap.set(4, 480)

imgBackground = cv2.imread('../Resources/photoBooth.png')
# Importing the mode images into a list
folderModePath = '../Resources/Modes'
modePathList = os.listdir(folderModePath)
imgModeList = []
for path in modePathList:
    imgModeList.append(cv2.imread(os.path.join(folderModePath, path)))
# print(len(imgModeList))

# Load the encoding file
print("Loading Encode File ...")
file = open('EncodeFile.p', 'rb')
encodeListKnownWithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownWithIds
# print(studentIds)
print("Encode File Loaded")

modeType = 0
counter = 0
id = -1
imgStudent = []
print(studentIds)

while True:
    success, img = cap.read()

    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    faceCurFrame = face_recognition.face_locations(imgS)
    encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

    imgBackground[82:82 + 480, 40:40 + 640] = img

    if faceCurFrame:
        for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):
            matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
            # print("matches", matches)
            # print("faceDis", faceDis)

            matchIndex = np.argmin(faceDis)
            # print("Match Index", matchIndex)
            # print(studentIds[matchIndex])

            if matches[matchIndex]:
                # print("Known Face Detected")
                # print(studentIds[matchIndex])
                y1, x2, y2, x1 = faceLoc
                y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                bbox = 40 + x1, 82 + y1, x2 - x1, y2 - y1
                imgBackground = cvzone.cornerRect(imgBackground, bbox, rt=0)
                print(studentIds[matchIndex])
                cv2.putText(imgBackground, studentIds[matchIndex], (27,630), 1, 2, (255,0,255), 2)
                dataGet(studentIds[matchIndex])

    cv2.imshow("Face Attendance", imgBackground)
    cv2.waitKey(1)