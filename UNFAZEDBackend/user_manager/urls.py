from django.urls import path 
from .views import *

urlpatterns = [
    path("login/", LoginAPIView.as_view()),
    path("profile/", ProfileAPIView.as_view()),
    path("profile/<int:rollno>/", ProfileAPIView.as_view()),
    path("subject/", SubjectAPIView.as_view()),
]