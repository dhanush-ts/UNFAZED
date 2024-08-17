from asyncio import QueueEmpty
from rest_framework import generics
from .serializers import *
from datetime import datetime
from rest_framework import status
from user_manager.authentication import *
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from features.models import Timetable

class AttendanceAPIView(generics.RetrieveAPIView, generics.CreateAPIView):
    authentication_classes = [IsAuthenticated]

    def get_authenticators(self):
        if self.request.method == 'GET':
            return super().get_authenticators()
        return []

    def get(self, request, *args, **kwargs):
        try:
            student = self.request.user
            date = self.kwargs.get('action')
            if date is not None:
                queryset = Attendance.objects.filter(student=student, date=date)
                serializer = AttendanceSerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                queryset = Attendance.objects.filter(student=student)
                subjects = Subject.objects.filter(klass=student.klass)
                response ={}
                for subject in subjects:
                    queryset = Attendance.objects.filter(subject=subject, student=student)
                    response[subject.title] = {
                        "total": queryset.count(),
                        "present": queryset.filter(status=1).count(),
                        "absent": queryset.filter(status=0).count(),
                    }

                return Response(response, status=status.HTTP_200_OK)
        except:
            return Response({'detail': 'Invalid Details'}, status=status.HTTP_400_BAD_REQUEST)
        

    def create(self, request, *args, **kwargs):
        try:
            year=request.data.get('year')
            department=request.data.get('department')
            section=request.data.get('section')
            klass=Klass.objects.get(year=year, department=department, section=section)
            timetable=Timetable.objects.filter(day=datetime.now().isoweekday(), subject__klass=klass).order_by('time')
            current_time=datetime.now().time()
            today=datetime.now().date()
            for slot in timetable:
                if slot.time < current_time:
                    subject=slot.subject
            if self.kwargs.get('action') is not None:
                    students = Student.objects.filter(klass=subject.klass)
                    for student in students:
                        Attendance.objects.get_or_create(
                            student = student,
                            subject = subject,
                            date = today,
                            status = 0
                        )

            else:
                rollno = request.data.get('rollno')
                try:
                    student = Student.objects.get(rollno=rollno)
                except Student.DoesNotExist:
                    return Response({'detail': 'Student Not Found'}, status=status.HTTP_404_NOT_FOUND)

                Attendance.objects.get_or_create(
                    student = student,
                    subject = subject,
                    date = today,
                    status = 1
                )
            return Response({'detail' : 'Success'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'detail': 'Invalid Details'}, status=status.HTTP_400_BAD_REQUEST)


class SubjectAtendancceAPI(generics.ListAPIView):
    authentication_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        try:
            subjectID = self.kwargs.get('subjectID') 
            subject = Subject.objects.get(id=subjectID)
            date = self.kwargs.get('date')
            if date is None:
                queryset = Attendance.objects.filter(subject=subject)
                students = Student.objects.filter(klass=subject.klass)
                response = {}
                response['data']=[]
                for student in students:
                    totalquery = queryset.filter(student=student)
                    response['total'] = totalquery.count()
                    response['data'].append({
                        "rollno" : student.rollno,
                        "name": student.name,
                        "present": totalquery.filter(status=1).count(),
                        "absent": totalquery.filter(status=0).count(),
                    })
                return Response(response, status=status.HTTP_200_OK)    
            else:
                queryset = Attendance.objects.filter(subject=subject, date=date)
                response = []
                for i in queryset:
                    response.append({
                        "rollno": i.student.rollno,
                        "name": i.student.name,
                        "status": i.status,
                    })
                return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'Invalid Details'}, status=status.HTTP_400_BAD_REQUEST)



class MarkAPIView(generics.ListAPIView, generics.UpdateAPIView):
    authentication_classes=[IsAuthenticated]
    serializer_class=MarkSerializer
    lookup_field='id'

    def get_queryset(self):
        user = self.request.user
        id=self.kwargs.get('id')
        if self.request.method=='GET':
            if isinstance(user, Student):
                return Mark.objects.filter(student=self.request.user, subject__id=id)
            else:
                return Mark.objects.filter(subject__id=id)
        else:
            return Mark.objects.filter(id=id)
    

class MaterialAPIView(generics.ListCreateAPIView):
    authentication_classes=[IsAuthenticated]
    serializer_class=MaterialSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        subjectID=self.kwargs.get('subjectID')
        user=self.request.user
        if isinstance(user, Student):
            return Material.objects.filter(subject__id=subjectID, category=user.category)
        else:
            return Material.objects.filter(subject__id=subjectID)
    
    def create(self, request, *args, **kwargs):
        try:
            subjectID=self.kwargs.get('subjectID')
            subject=Subject.objects.get(id=subjectID)
            material = Material(
                    file=request.FILES.get('file'), 
                    category=request.data.get('category'), 
                    name=request.data.get('name'), 
                    subject=subject
                )
            material.save()
            return Response({'detail': 'Success'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'detail': 'Invalid Details'}, status=status.HTTP_400_BAD_REQUEST)