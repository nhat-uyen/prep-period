from app.models.lesson import RequestLesson, ResponseLesson
from app.services.ai_service import (build_prompt, generate_response)

def generate_lesson_using_ai_service(request_lesson: RequestLesson):
    prompt = build_prompt(
        subject=request_lesson.subject,
        topic=request_lesson.topic,
        grade=request_lesson.grade,
        duration_minutes=request_lesson.duration_minutes
    )

    # AI integration logic would go here. For now, we'll simulate a response.
    lesson = generate_response(prompt)
    return {"lesson": lesson}