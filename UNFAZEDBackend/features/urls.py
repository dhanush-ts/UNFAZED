from django.urls import path 
from .views import *

urlpatterns = [
    path("timetable/<int:day>/", TimetableAPIView.as_view()),
    path("events/", EventAPIView.as_view()),
    path("feedback/", FeedbackAPIView.as_view()),
    path("feedback/<int:subjectID>/", FeedbackAPIView.as_view()),
    path("interaction/", InteractionAPIView.as_view()),
    path("interaction/<int:subjectID>/", InteractionAPIView.as_view()),
    path("query/", ChatBotAPIView.as_view()),
]