import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from user_manager.models import *
from django.utils import timezone
from datetime import datetime
class IsAuthenticated(authentication.BaseAuthentication):
    
    def authenticate_header(self, request):
        return "Invalid Token"
    
    def authenticate(self, request):
        try:
            token = request.META.get('HTTP_AUTHORIZATION')
            if not token:
                raise exceptions.AuthenticationFailed()
            token = token.split()[-1]
            try:
                payload = jwt.decode(token, settings.JWT_ACCESS_SECRET, 'HS256')
            except jwt.ExpiredSignatureError:
                raise exceptions.AuthenticationFailed()
            id = payload.get('id')
            user_type = payload.get('user_type')
            try:
                if user_type=="student":
                    user = Student.objects.get(rollno=id)
                elif user_type=="staff":
                    user = Staff.objects.get(id=id)
            except:
                raise exceptions.AuthenticationFailed()
            return (user, token)
        except:
            raise exceptions.AuthenticationFailed()
        
def generate_token(user):
    if isinstance(user, Student):
        payload = {
            'id': user.rollno,
            'user_type': 'student',
            'exp': datetime.now() + timezone.timedelta(days=365),
        }
    else:
        payload = {
            'id': user.id,
            'user_type': 'staff',
            'exp': datetime.now() + timezone.timedelta(days=365),
        }
    token = jwt.encode(payload, settings.JWT_ACCESS_SECRET, algorithm='HS256')
    return token

