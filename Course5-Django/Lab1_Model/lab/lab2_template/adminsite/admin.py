from django.contrib import admin
from .models import Course, Instructor, Lesson

# Register your models here.
class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 3

class CourseAdmin(admin.ModelAdmin):
    fields = ['pub_date', 'name', 'description']
    inlines = [LessonInline]

class InstructorAdmin(admin.ModelAdmin):
    fields = ['user', 'full_time']

admin.site.register(Course, CourseAdmin)
admin.site.register(Instructor, InstructorAdmin)

