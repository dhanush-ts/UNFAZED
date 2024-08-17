from django.db import models
from user_manager.models import Klass, Staff, Subject

class Timetable(models.Model):
    day = models.PositiveSmallIntegerField(choices=[
        (1, "Monday"), 
        (2, "Tuesday"), 
        (3, "Wednesday"), 
        (4, "Thursday"), 
        (5, "Friday"),
        (6, "Saturday"),
        (7, "Sunday")
    ])
    time = models.TimeField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('day', 'time', 'subject')

    def __str__(self) -> str:
        return f"{self.day} - {self.time} - {self.subject}"

class Event(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateField()
    description = models.TextField()
    year = models.PositiveSmallIntegerField(choices=[(x, x) for x in [1, 2, 3, 4]])
    department = models.CharField(max_length=10, choices=[(x, x) for x in ["CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL"]])

    def __str__(self):
        return f"{self.title} - {self.year} - {self.department}"


class Feedback(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    rating = models.FloatField()
    comment = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.subject} - {self.rating}"


class Interaction(models.Model):
    created_at = models.DateTimeField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()

    def __str__(self) -> str:
        return f"{self.created_at} - {self.subject} - {self.rating}"
    