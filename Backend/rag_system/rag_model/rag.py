from sklearn.metrics.pairwise import cosine_similarity
from api.models import Course
from django.db import connection
import torch
from transformers import pipeline
from transformers import AutoModel, AutoTokenizer, AutoModelForCausalLM, AutoModelForSeq2SeqLM, pipeline, TextStreamer

class RAGModel:
    
    def __init__(self):

        # Initialize the retrieval model for embeddings
        self.retrieval_tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        self.retrieval_model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

        # Initialize LLaMA-2 model for generation
        self.generator_tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-1B")
        self.generator_model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-1B").to("cpu")
        
        # Set pad_token and eos_token if not defined
        if self.generator_tokenizer.pad_token is None:
            self.generator_tokenizer.pad_token = self.generator_tokenizer.eos_token or "[PAD]"
        if self.generator_tokenizer.eos_token is None:
            self.generator_tokenizer.eos_token = "[EOS]"
        self.generator_model.config.pad_token_id = self.generator_tokenizer.pad_token_id

        # Get all field names from the Course model dynamically
        self.course_fields = [field.name for field in Course._meta.get_fields()]

        

    def get_embeddings(self, text):
        """Convert text to embeddings for retrieval."""
        inputs = self.retrieval_tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        with torch.no_grad():
            embeddings = self.retrieval_model(**inputs).last_hidden_state.mean(dim=1)
        return embeddings.squeeze(0)

    def retrieve_courses(self, query, top_k=1):
        """Retrieve the most relevant course based on the query, dynamically using all fields."""
        query_embedding = self.get_embeddings(query).unsqueeze(0)  # Shape: [1, embedding_dim]

        # Fetch all fields for each course from the database
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM zqm_module_en")
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]

        if not rows:
            print("No rows returned from database")
            return []

        # Convert rows to a list of dictionaries for easy access by column name
        courses = [dict(zip(columns, row)) for row in rows]

        # Combine all non-empty field values into a single string for each course
        course_texts = [
            " ".join(str(course[field]) for field in self.course_fields if course.get(field)) for course in courses
        ]
        
        # Generate embeddings for each course's combined text
        course_embeddings = [self.get_embeddings(text) for text in course_texts]
        course_embeddings = torch.stack(course_embeddings)  # Shape: [num_courses, embedding_dim]

        # Calculate cosine similarity between the query embedding and course embeddings
        similarities = cosine_similarity(query_embedding, course_embeddings)
        
        # Sort courses by descending similarity and select the top_k results
        top_k_indices = similarities.argsort()[0][-top_k:][::-1]
        top_courses = [courses[idx] for idx in top_k_indices]

        # Further filter by exact title match if course name is specified in the query
        for course in top_courses:
            if course['title'].lower() in query.lower():
                return [course]  # Return the exact course match

        # Return the top course if no exact match found
        return top_courses[:1]

    def generate_answer(self, query):
        """Generate an answer based on the retrieved course and the query."""
        retrieved_courses = self.retrieve_courses(query)

        # If no course matches, return a default response
        if not retrieved_courses:
            return "No matching course found in the database."

        # Retrieve only the best-matched course
        course = retrieved_courses[0]
        print(course, "retreived course")

        # key_fields = ['title', 'instructor']
        # context_text = "Course Information:\n"
        # for field in key_fields:
        #     field_value = course.get(field)
        #     if field_value:  # Include only non-empty fields
        #         context_text += f"{field.replace('_', ' ').title()}: {field_value}\n"
        context_text = "Course Information:\n\n"
        for field in self.course_fields:
            field_value = course.get(field)
            if field_value:  # Only include non-empty fields
                context_text += f"{field.replace('_', ' ').title()}: {field_value}\n"

        # Dynamically build the context based on non-empty fields
        # context_text = "Course Information:\n\n"
        # for field in self.course_fields:
        #     field_value = course.get(field)
        #     if field_value:  # Only include non-empty fields
        #         context_text += f"{field.replace('_', ' ').title()}: {field_value}\n"

        prompt = f"User query: {query}\nAnswer:"

        # Tokenize the prompt
        inputs = self.generator_tokenizer(prompt, return_tensors="pt", padding=True, truncation=True).to("cpu")

        # Generate text, explicitly passing `attention_mask` to ensure correct attention handling
        outputs = self.generator_model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],  # Explicit attention mask to distinguish padding
            max_length=inputs["input_ids"].shape[1] + 100,
            do_sample=True,
            pad_token_id=self.generator_tokenizer.pad_token_id,
            eos_token_id=self.generator_tokenizer.eos_token_id
        )

        # Decode the generated response and return
        generated_response = self.generator_tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
        return generated_response
