from django.db import models
from user_manager.models import Student, Subject, Klass


class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True)
    # time = models.TimeField(auto_now_add=True)
    status = models.PositiveSmallIntegerField(choices=[(2, "Late"), (1, "Present"), (0, "Absent")])

    class Meta:
        unique_together = ('student', 'date', 'subject')

    def __str__(self):
        return f"{self.student} - {self.date} - {self.subject} - {self.status}"


class Mark(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    exam = models.CharField(max_length=10, choices=[(x, x) for x in ["CAT 1", "CAT 2", "CAT 3", "SEM"]])
    secured = models.PositiveSmallIntegerField(null=True, blank=True)
    total = models.PositiveSmallIntegerField(null=True, blank=True, default=100)

    class Meta:
        unique_together = ('student', 'subject', 'exam')

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.exam} - {self.secured}"
    

class Material(models.Model):
    file = models.FileField(upload_to="materials/")
    name = models.CharField(max_length=255)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.PositiveSmallIntegerField(choices=[
            (0, "Common"), 
            (1, "Weak Learner"), 
            (2, "Average"), 
            (3, "Good"), 
            (4, "Topper")
        ])
    
    def __unicode__(self):
        return self.subject
    
    def __str__(self) -> str:
        return f"{self.name} - {self.subject} - {self.category}"
