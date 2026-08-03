import json
from app.services.ai_service import generate_response
from app.prompts.lesson_prompt import build_prompt
from app.models.lesson import LessonRequest

def generate_lesson_using_ai_service(request: LessonRequest):
    prompt = build_prompt(
        subject=request.subject,
        topic=request.topic,
        grade=request.grade,
        duration_minutes=request.duration_minutes
    )

    # AI integration logic would go here. For now, we'll simulate a response.
    lesson = generate_response(prompt)
    lesson_data = json.loads(lesson)  # Assuming the AI returns a valid JSON string
    return lesson_data