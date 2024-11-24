import re
from .models import Course
from django.db import connection

def get_suggestions(query):
    # Fetch course titles dynamically from the database
    courses = Course.objects.values('title', 'learning_obj', 'instructor')  # Adjust fields as needed

    # Define templates for question suggestions
    templates = [
        "What is the meaning of {}?",
        "Who is the instructor for {}?",
        "What are the prerequisites for {}?",
        "What topics are covered in {}?",
        "What can I do after completing {}?",
    ]

    # Generate suggestions by matching user input with course data
    suggestions = []
    for course in courses:
        for field in ['title', 'learning_obj', 'instructor']:
            content = course[field]
            if content and re.search(query, content, re.IGNORECASE):
                for template in templates:
                    suggestions.append(template.format(content))
    
    # Remove duplicates and limit to top 5 suggestions
    return list(set(suggestions))[:5]
