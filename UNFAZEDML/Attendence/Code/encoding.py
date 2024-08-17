import cv2
import face_recognition
import pickle
import os


# Importing student images
folderPath = '../Images untrained'
pathList = os.listdir(folderPath)
print(pathList)
imgList = []
studentIds = []
for path in pathList:
    img = cv2.imread(os.path.join(folderPath, path))
    faceCurFrame = face_recognition.face_locations(img)
    if len(faceCurFrame) > 0:
        # Get the coordinates of the first face
        y1, x2, y2, x1 = faceCurFrame[0]

        # Crop the face from the image
        face_img = img[y1:y2, x1:x2]
        imgList.append(face_img)
        cv2.imwrite("../New Images/"+path, face_img)
        studentIds.append(os.path.splitext(path)[0])

    fileName = f'{folderPath}/{path}'

print(studentIds)


def findEncodings(imagesList):
    encodeList = []
    a = 0
    for img in imagesList:
        print(a)
        a+=1
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)

    return encodeList


print("Encoding Started ...")
encodeListKnown = findEncodings(imgList)
encodeListKnownWithIds = [encodeListKnown, studentIds]
print("Encoding Complete")

file = open("EncodeFile.p", 'wb')
pickle.dump(encodeListKnownWithIds, file)
file.close()
print("File Saved")
