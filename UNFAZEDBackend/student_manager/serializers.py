from rest_framework import serializers
from .models import *
from user_manager.serializers import *

class AttendanceSerializer(serializers.ModelSerializer):
    subject = SubjectOnlySerializer()
    class Meta:
        model = Attendance
        exclude = ('student', 'id')


class MarkSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    class Meta:
        model = Mark
        exclude = ('subject', )


class StudentMarksSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    class Meta:
        model = Mark
        exclude = ('subject', )
    

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        exclude = ('subject', )
        
    
