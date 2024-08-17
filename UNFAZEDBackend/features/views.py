from rest_framework import generics, status
from rest_framework.response import Response
from student_manager.models import *
from user_manager.authentication import IsAuthenticated
from user_manager.models import Student
from .models import *
from .serializers import *
from datetime import datetime
from rest_framework.views import APIView
from django.db.models import Avg
from datetime import datetime

class TimetableAPIView(generics.ListAPIView):
    authentication_classes = [IsAuthenticated]
    serializer_class = TimetableSerializer

    def get_queryset(self):
        user = self.request.user
        day=self.kwargs.get("day")
        if isinstance(user, Student):
            return Timetable.objects.filter(day= day, subject__klass=user.klass).order_by('time')
        else:
            return Timetable.objects.filter(day=day, subject__staff=user).order_by('time')


class EventAPIView(generics.ListCreateAPIView):
    authentication_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        student = self.request.user
        return Event.objects.filter(
                year=student.klass.year, 
                department=student.klass.department, 
                date__gt=datetime.now()
            ).order_by('date')
    
    def create(self, request, *args, **kwargs):
        try:
            title = request.data.get('title')
            date = request.data.get('date')
            description = request.data.get('description')
            year = request.data.get('year')
            department = request.data.get('department')
            Event.objects.create(
                title=title,
                date=date,
                description=description,
                year=year,
                department=department,
            )
            return Response({'detail' : 'Success'}, status=status.HTTP_201_CREATED)
        except:
            return Response({'detail' : 'Invalid details'}, status=status.HTTP_400_BAD_REQUEST)


class FeedbackAPIView(generics.CreateAPIView, generics.RetrieveAPIView):
    authentication_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            subjectID = request.data.get("subjectID")
            comment = request.data.get("comment")
            rating = request.data.get("rating")
            subject = Subject.objects.get(id=subjectID)
            Feedback.objects.create(
                    subject=subject, 
                    comment=comment,
                    rating=rating
                )
            return Response({'detail' : 'Success'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'detail' : 'Invalid details'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        try:
            subjectID = self.kwargs.get('subjectID')
            response = {}
            queryset = Feedback.objects.filter(subject__id=subjectID)
            average = queryset.aggregate(Avg('rating'))
            response['overall_rating'] = average['rating__avg']
            response['feedback']=[]
            for feedback in queryset:
                response['feedback'].append({
                    "rating": feedback.rating,
                    "comment": feedback.comment,
                })
            return Response(response, status=status.HTTP_200_OK)
        except:
            return Response({'detail' : 'Invalid details'}, status=status.HTTP_400_BAD_REQUEST)


class InteractionAPIView(generics.ListCreateAPIView):
    authentication_classes = [IsAuthenticated]
    serializer_class = InteractionSerializer

    def get_authenticators(self):
        return super().get_authenticators() if self.request.method == 'GET' else []
    
    def get_queryset(self):
        return Interaction.objects.filter(subject=self.kwargs.get('subjectID')).order_by('-created_at')[:15]    

    def create(self, request, *args, **kwargs):
        try:
            year=request.data.get('year')
            department=request.data.get('department')
            section=request.data.get('section')
            klass=Klass.objects.get(year=year, department=department, section=section)
            timetable=Timetable.objects.filter(day=datetime.now().isoweekday(), subject__klass=klass).order_by('time')
            current_time=datetime.now().time()
            for slot in timetable:
                if slot.time < current_time:
                    subject=slot.subject

            rating=request.data.get('rating')
            Interaction.objects.create(
                    subject=subject, 
                    rating=rating
                )
            return Response({'detail' : 'Success'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'detail' : 'Invalid details'}, status=status.HTTP_400_BAD_REQUEST)
        


import google.generativeai as genai
import PyPDF2

genai.configure(api_key="AIzaSyAZTk2YLhMdph0gJIF-wHEMGQ5U0BrjLc8")

model = genai.GenerativeModel('gemini-1.5-flash')


def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            extracted_text = ''
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                extracted_text += page.extract_text()
            return extracted_text
    except Exception as e:
        print(e)
        return ""


class ChatBotAPIView(APIView):
    def post(self, request):
        try:
            # print(request.data)
            fileID = request.data.get('fileID')
            # print(fileID)
            question = request.data.get('question')
            file_path = Material.objects.get(id=fileID).file.path
            text=extract_text_from_pdf(file_path)
            text =  text +"\n" + "From the contents, give me the answer for : " + question
            # print(text)
            response = model.generate_content(text)
            # print(response)
            return Response({'detail' : response.text}, status=status.HTTP_200_OK)
            # return Response({'detail' : "hello"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'detail' : 'Invalid details'}, status=status.HTTP_400_BAD_REQUEST)