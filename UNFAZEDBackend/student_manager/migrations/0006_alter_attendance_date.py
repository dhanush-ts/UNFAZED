# Generated by Django 5.0.7 on 2024-08-11 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student_manager', '0005_alter_attendance_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='date',
            field=models.DateField(),
        ),
    ]
