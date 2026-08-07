import json
import logging

from fastapi import HTTPException
from pydantic_core import ValidationError

from app.llm.ollama_client import generate_response
from app.llm.lesson_prompt import build_prompt
from app.models.lesson import LessonRequest, LessonResponse

logger = logging.getLogger(__name__)

def generate_lesson_using_ai_service(request: LessonRequest):
    logger.info("Generating lesson | Subject: %s, Topic: %s, Grade: %s", request.subject, request.topic, request.grade)

    prompt = build_prompt(
        subject=request.subject,
        topic=request.topic,
        grade=request.grade,
        duration_minutes=request.duration_minutes,
    )
    
    try:
        lesson_data= json.loads(generate_response(prompt))

        lesson_data["subject"] = request.subject
        lesson_data["topic"] = request.topic
        
        logger.info("Lesson generated successfully.")

        return LessonResponse(**lesson_data)
    
    # Catch errors when AI did not return valid JSON
    except json.JSONDecodeError:
        logger.exception("AI returned invalid JSON.")
        raise HTTPException(status_code=500, detail="Invalid response from AI")
    # Catch errors when AI returned valid JSON but it does not match the LessonResponse schema
    except ValidationError as e:
        logger.exception("AI returned JSON that does not match the LessonResponse schema.")
        raise HTTPException(status_code=500, detail=f"Validation error: {e}")