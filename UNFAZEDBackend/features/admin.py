from django.contrib import admin

# from HacktivateBackend.features.views import InteractionAPIView
from .models import *

class TimeTableAdmin(admin.ModelAdmin):
    list_display = ['day', 'time', 'subject']
    list_filter = ['day','subject__klass']
    search_fields = ['day', 'subject']

admin.site.register(Timetable, TimeTableAdmin)


admin.site.register(Event)

class FeedBackAdmin(admin.ModelAdmin):
    list_display = ['subject', 'rating']
    list_filter = ['subject', 'subject__klass']

admin.site.register(Feedback, FeedBackAdmin)


class InteractionAdmin(admin.ModelAdmin):
    list_display = ['created_at', 'subject', 'rating']
    list_filter = ['subject__klass']

admin.site.register(Interaction, InteractionAdmin)
