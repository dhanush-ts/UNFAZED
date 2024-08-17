from ast import Sub
from pstats import Stats
from ssl import create_default_context
from urllib import response
from rest_framework import generics, status, exceptions
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from .helper_functions import AuthHelper
from .serializers import StaffSerializer, StudentMasterSerializer, StudentSerializer, SubjectSerializer
from .models import *
from .authentication import *

class LoginAPIView(APIView):
    
    def post(self, request):
        try:
            id = request.data.get('id')
            user_type = request.data.get('user_type')
            password = request.data.get('password')
            try:
                user = AuthHelper.get_user(id, user_type)
            except:
                return Response({'detail':"User Not Found"}, status=status.HTTP_404_NOT_FOUND)
            if user and check_password(password, user.password):
                token = generate_token(user)
                return Response({"token": token}, status=status.HTTP_200_OK)
            else:
                return Response({'detail':"Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            raise exceptions.ValidationError()
        
        
class ProfileAPIView(generics.RetrieveUpdateAPIView):
    authentication_classes = [IsAuthenticated]

    def get_authenticators(self):
        if self.request.method == 'PATCH':
            return []
        return super().get_authenticators()

    def get_serializer_class(self):
        return StaffSerializer if isinstance(self.request.user, Staff) else StudentMasterSerializer

    def get_object(self):
        if self.request.method == "PATCH":
            return Student.objects.get(rollno=self.kwargs.get("rollno"))
        return self.request.user
    


class SubjectAPIView(generics.ListAPIView, generics.CreateAPIView):
    authentication_classes = [IsAuthenticated]
    serializer_class = SubjectSerializer
    
    def list(self, request, *args, **kwargs):
        try:
            user = self.request.user
            if isinstance(user, Staff):
                queryset =  Subject.objects.filter(staff=user)
                serializer = SubjectSerializer(queryset, context=self.get_serializer_context(), many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                
                queryset =  Subject.objects.filter(klass=user.klass)
                serializer = SubjectSerializer(queryset, context=self.get_serializer_context(), many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'detail' : 'Invalid Request'}, status=status.HTTP_400_BAD_REQUEST)
    


    def create(self, request, *args, **kwargs):
        try:
            import random
            from datetime import datetime, timedelta
            from django.utils import timezone
            from features.models import Interaction, Timetable

            # Fetch timetable entries for the current day
            today = timezone.now().date()
            timetables = Timetable.objects.filter(day=2)  # day = 1 (Monday) to 7 (Sunday)
            created_interactions = set()

            # Generate mock interaction data
            for timetable in timetables:
                # Calculate the interaction time to be 5 minutes before the scheduled period
                period_start_time = datetime.combine(today, timetable.time)
                interaction_time = period_start_time - timedelta(minutes=5)

                unique_key = (timetable.subject.id, interaction_time.date())
                if unique_key not in created_interactions:
                    Interaction.objects.create(
                        created_at=interaction_time,
                        subject=timetable.subject,
                        rating=random.randint(20,100)  # Assuming rating is between 1 and 5
                    )
                    created_interactions.add(unique_key)

                
                # Create a new interaction entry
                Interaction.objects.create(
                    created_at=interaction_time,
                    subject=timetable.subject,
                    rating=random.randint(20, 100)  # Assuming rating is between 1 and 5
                )

            print("Mock interaction data generated successfully.")

            return Response()

        except Exception as e:
            print(e)
            return Response()