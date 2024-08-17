from django.urls import path 
from .views import *

urlpatterns = [
    path("attendance/", AttendanceAPIView.as_view()),
    path("attendance/<str:action>/", AttendanceAPIView.as_view()),

    path("sub-attendance/<int:subjectID>/overall/", SubjectAtendancceAPI.as_view()),
    path("sub-attendance/<int:subjectID>/<str:date>/", SubjectAtendancceAPI.as_view()),
    
    path("mark/<int:id>/", MarkAPIView.as_view()),
    path("material/<int:subjectID>/", MaterialAPIView.as_view()),
]