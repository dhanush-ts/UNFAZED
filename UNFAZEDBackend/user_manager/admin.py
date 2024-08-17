from typing import Any
from django.contrib import admin
from .models import *
from student_manager.models import *

admin.site.register(Klass)

class StudentAdmin(admin.ModelAdmin):
    list_display = ['rollno', 'name', 'klass', 'category']
    list_filter = ['klass', 'category']
    search_fields = ['rollno', 'name']
    def save_model(self, request: Any, student: Student, form: Any, change: Any) -> None:
        super().save_model(request, student, form, change)
        try:
            if not change:
                subjects = Subject.objects.filter(klass=student.klass)
                for subject in subjects:
                    for exam in ["CAT 1", "CAT 2", "CAT 3", "SEM"]:
                        Mark.objects.create(    
                            student=student,
                            subject=subject,
                            exam=exam,
                        )
        except:
            pass
    
admin.site.register(Student, StudentAdmin)


class StaffAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['id', 'name']

admin.site.register(Staff, StaffAdmin)

class SubjectAdmin(admin.ModelAdmin):
    list_display = ['code', 'title', 'staff', 'klass']
    search_fields = ['code', 'title']
    list_filter = ['code', 'staff__name', 'klass']
    def save_model(self, request: Any, subject: Subject, form: Any, change: Any) -> None:
        super().save_model(request, subject, form, change)
        try:
            students = Student.objects.filter(klass=subject.klass)
            for student in students:
                for exam in ["CAT 1", "CAT 2", "CAT 3", "SEM"]:
                        Mark.objects.create(    
                            student=student,
                            subject=subject,
                            exam=exam,
                        )
        except:
            pass

admin.site.register(Subject, SubjectAdmin)