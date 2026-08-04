from ollama import chat

from app.models.lesson import LessonResponse

def generate_response(prompt:str) -> str:
    response = chat(
        model="llama3.2",
        messages=[
            {"role": "user", "content": prompt}
        ],
        format = LessonResponse.model_json_schema()
    )
    return response.message.content