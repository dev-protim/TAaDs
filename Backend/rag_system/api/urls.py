from django.urls import path
from . import views

urlpatterns = [
    path('query/', views.query_courses, name='query_courses'),
    path('suggestions/', views.get_suggestions_view, name='get_suggestions'),
]
