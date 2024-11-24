from django.db import models

class Course(models.Model):
    title = models.TextField()
    instructor = models.TextField()
    learning_obj = models.TextField()
    course_contents = models.TextField()
    teaching_methods = models.TextField()
    prerequisites = models.TextField()
    readings = models.TextField()
    applicability = models.TextField()
    workload = models.TextField()
    credits = models.IntegerField()
    evaluation = models.TextField()
    time = models.TextField()
    frequency = models.TextField()
    duration = models.TextField()
    course_type = models.TextField()
    remarks = models.TextField()

    class Meta:
        db_table = 'zqm_module_en'
        managed = False

    def __str__(self):
        return self.title
