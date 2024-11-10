from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Course
from .serializers import CourseSerializer
from .utils import get_suggestions
from rag_model.rag import RAGModel  # Import RAGModel

rag_model = RAGModel()  # Initialize the RAG model

@api_view(['POST'])
def query_courses(request):
    # query = request.data.get('query', "")
    # # For now, return all courses as an example (modify to apply RAG logic here)
    # courses = Course.objects.all()
    # serializer = CourseSerializer(courses, many=True)
    # return Response(serializer.data)
    query = request.data.get('query', "")
    # Generate an answer using the RAG model
    response = rag_model.generate_answer(query)
    return Response({"response": response})

@api_view(['POST'])
def get_suggestions_view(request):
    query = request.data.get('query', "")
    suggestions = get_suggestions(query)
    return Response({"suggestions": suggestions})
