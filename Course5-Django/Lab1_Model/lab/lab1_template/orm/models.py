from django.db import models



# Define your first model from here:
class User(models.Model):
    # First Name
    first_name = models.CharField(null=False, max_length=30, default='John')
    # Last name
    last_name = models.CharField(null=False, max_length=30, default='doe')
    # Date of birth (DoB)
    dob = models.DateField(null=True)
