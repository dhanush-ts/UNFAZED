import jwt
from django.conf import settings
from .models import *
from .serializers import *

class AuthHelper():

    @staticmethod
    def get_user_id(access_token):
        payload = jwt.decode(access_token, settings.JWT_ACCESS_SECRET, 'HS256', verify=False)
        return payload['id']

    @staticmethod
    def get_user_type(access_token):
        payload = jwt.decode(access_token, settings.JWT_ACCESS_SECRET, 'HS256', verify=False)
        return payload['user_type']
    
    @staticmethod
    def get_user(id, user_type):
        try:
            if user_type == 'student':
                user = Student.objects.get(rollno=id)
            elif user_type == 'staff':
                user = Staff.objects.get(id=id)
            else:
                raise Exception("Invalid User")
        except Exception:
            raise Exception("User not Found")
        return user