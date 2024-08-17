from rest_framework import serializers
from user_manager.serializers import SubjectSerializer
from .models import *

class TimetableSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()
    class Meta:
        model = Timetable
        exclude = ('id', 'day')


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ('year', 'department')

class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        exclude = ('subject', 'id')