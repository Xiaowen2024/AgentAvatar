from keras.models import load_model
from time import sleep
from keras_preprocessing.image import img_to_array
import cv2
import matplotlib.pyplot as plt
import numpy as np

face_classifier = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
emotion_model = load_model('emotion_detection_model_50epochs.h5')
class_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

def classify_emotions():
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    if not ret:
        cap.release()
        cv2.destroyAllWindows()
        return None
    
    gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    faces=face_classifier.detectMultiScale(gray,1.3,5)
    label = None
    for (x,y,w,h) in faces:
        cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
        roi_gray=gray[y:y+h,x:x+w]
        roi_gray=cv2.resize(roi_gray,(48,48),interpolation=cv2.INTER_AREA)
        roi=roi_gray.astype('float')/255.0 
        roi=img_to_array(roi)
        roi=np.expand_dims(roi,axis=0)  
        preds=emotion_model.predict(roi)[0]  
        label=class_labels[preds.argmax()]  
        break 

    cap.release()
    cv2.destroyAllWindows()
    return label
   




































