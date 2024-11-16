from datetime import date

from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def index(request):
    # Create a simple html page as a string
    template = "<html>" \
                "This is your first view" \
               "</html>"
    # Return the template as content argument in HTTP response
    return HttpResponse(content=template)

def getdate(request):
    # Get the current date
    today = date.today()

    # Create a simple html page as a string
    template = "<html>" \
                "Today's date is: {}"\
               "</html>".format(today)
    # Return the template as content argument in HTTP response
    return HttpResponse(content=template)