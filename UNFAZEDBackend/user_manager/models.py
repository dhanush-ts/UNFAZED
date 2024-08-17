from typing import Iterable
from django.db import models
from django.contrib.auth.hashers import make_password

class Klass(models.Model):
    year = models.PositiveSmallIntegerField(choices=[(x, x) for x in [1, 2, 3, 4]])
    department = models.CharField(max_length=10, choices=[(x, x) for x in ["CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL"]])
    section = models.CharField(max_length=1)

    class Meta:
        unique_together = ('year', 'department', 'section')

    def __str__(self) -> str:
        return f"{self.year} - {self.department} - {self.section}"


class Student(models.Model):
    rollno = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255, default='Changeme@123')
    klass = models.ForeignKey(Klass, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.PositiveSmallIntegerField(choices=[
            (0, "Common"), 
            (1, "Weak Learner"), 
            (2, "Average"), 
            (3, "Good"), 
            (4, "Topper")
        ], default=0)
    
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_sha256$'):
            self.password = 'pbkdf2_sha256$720000$rf9EvNzVRlJbtWRrql9vQB$cEPZ+hHE5//65/XTiXRIf6hnIKfraTooP77KfgDHNbc='
            # self.password = make_password(self.password)        
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.rollno} - {self.name}"


class Staff(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255, default='Changeme@123')

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)        
        super().save(*args, **kwargs)


    def __str__(self) -> str:
        return f"{self.id} - {self.name}"
    

class Subject(models.Model):
    code = models.CharField(max_length=20)
    title = models.CharField(max_length=255)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    klass = models.ForeignKey(Klass, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('code', 'klass')

    def __str__(self) -> str:
        return f"{self.title} - {self.klass}"