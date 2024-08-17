from ast import Return
from rest_framework import serializers
from .models import *

class KlassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Klass
        fields = '__all__'


class StudentMasterSerializer(serializers.ModelSerializer):
    klass = KlassSerializer()
    class Meta:
        model = Student
        exclude = ('password', 'id')


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        exclude = ('password', 'id', 'klass')


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        exclude = ('password', 'id')


class SubjectSerializer(serializers.ModelSerializer):
    klass = KlassSerializer()
    staff = StaffSerializer()
    category = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = '__all__'
    
    def get_category(self, subject):
        # print(">>>>>>>>>>>>>>>>>>>>>>>>>>>")
        try:
            user = self.context['request'].user
            # print(user)
            response = {}
            if isinstance(user, Staff):
                queryset = Student.objects.filter(klass=subject.klass)
                response['total'] =  queryset.count()
                response['common'] =  queryset.filter(category=0).count()
                response['weak_learner'] =  queryset.filter(category=1).count()
                response['average'] =  queryset.filter(category=2).count()
                response['good'] =  queryset.filter(category=3).count()
                response['topper'] =  queryset.filter(category=4).count()
            return response
        except Exception as e:
            print(e)
            return {}


class SubjectOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        exclude = ('staff', 'id', 'klass')