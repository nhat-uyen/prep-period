import json
from fastapi import HTTPException
from pydantic_core import ValidationError

from app.llm.ollama_client import generate_response
from app.llm.lesson_prompt import build_prompt
from app.models.lesson import LessonRequest, LessonResponse

def generate_lesson_using_ai_service(request: LessonRequest):
    prompt = build_prompt(
        subject=request.subject,
        topic=request.topic,
        grade=request.grade,
        duration_minutes=request.duration_minutes
    )

    # AI integration logic would go here. For now, we'll simulate a response.
    
    try:
        lesson_data= json.loads(generate_response(prompt))
        lesson_data["subject"] = request.subject
        lesson_data["topic"] = request.topic
        return LessonResponse(**lesson_data)
    # Catch errors when AI did not return valid JSON
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid response from AI")
    # Catch errors when AI returned valid JSON but it does not match the LessonResponse schema
    except ValidationError as e:
        raise HTTPException(status_code=500, detail=f"Validation error: {e}")