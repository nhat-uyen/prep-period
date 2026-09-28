import json
import logging

from fastapi import HTTPException
from pydantic_core import ValidationError
from sqlalchemy.orm import Session

from app.llm.ollama_client import generate_response
from app.llm.lesson_prompt import build_prompt
from app.models.lesson import LessonRequest, LessonResponse
from app.database.models import Activity as ActivityRecord, Lesson as LessonRecord
from app.database import lesson_crud


logger = logging.getLogger(__name__)

def generate_lesson_using_ai_service(request: LessonRequest, db: Session):
    logger.info("Generating lesson | Subject: %s, Topic: %s, Grade: %s", request.subject, request.topic, request.grade)

    prompt = build_prompt(
        subject=request.subject,
        topic=request.topic,
        grade=request.grade,
        duration_minutes=request.duration_minutes,
    )
    
    try:
        lesson_data= json.loads(generate_response(prompt))
        
        logger.info("Lesson generated successfully.")
        lesson = LessonResponse(**lesson_data)

        saved_lesson_with_id = save_lesson_to_databse(db, request, lesson)

        return saved_lesson_with_id
    
    # Catch errors when AI did not return valid JSON
    except json.JSONDecodeError:
        logger.exception("AI returned invalid JSON.")
        raise HTTPException(status_code=500, detail="Invalid response from AI")
    # Catch errors when AI returned valid JSON but it does not match the LessonResponse schema
    except ValidationError as e:
        logger.exception("AI returned JSON that does not match the LessonResponse schema.")
        raise HTTPException(status_code=500, detail=f"Validation error: {e}")

def lesson_form_in_database(lesson: LessonRecord, activities: list[ActivityRecord]):
    return {"id": lesson.id,
            "subject": lesson.subject,
            "topic": lesson.topic,
            "grade": lesson.grade,
            "duration_minutes": lesson.duration_minutes,
            **lesson.lesson_json,
            "activities": [
                           {
                               "id": activity.id,
                               "lesson_id": activity.lesson_id,
                               "name": activity.name,
                               "duration_minutes": activity.duration_minutes,
                               "teacher_notes_prompts": activity.teacher_notes_prompts,
                               "student_instructions": activity.student_instructions
                           }
                           for activity in activities
                       ],      
                 }

def save_lesson_to_databse(db: Session, request: LessonRequest, lesson: LessonResponse):
    # TODO: add options to whether or not to save lesson to databse
    saved_lesson = lesson_crud.create_lesson(db=db,
                       subject=request.subject,
                       topic=request.topic,
                       grade=request.grade,
                       duration_minutes= request.duration_minutes,
                       activities=lesson.activities,
                       lesson_json=lesson.model_dump()  # converts the Pydantic model into a dictionary
    )

    activities = lesson_crud.get_activities(db=db, lesson_id=saved_lesson.id)
    return lesson_form_in_database(saved_lesson, activities)

def save_streamed_lesson(db: Session, full_response: str, request: LessonRequest):
  try:
    lesson_data = json.loads(full_response)
    lesson = LessonResponse(**lesson_data)

    lesson_with_id = save_lesson_to_databse(db, request, lesson)
    return lesson_with_id
  
  except json.JSONDecodeError:
          logger.exception("AI returned invalid JSON.")
          raise HTTPException(status_code=500, detail="Invalid response from AI")

def get_lesson(db: Session, lesson_id: int):
    lesson = lesson_crud.get_lesson_by_id(db=db, lesson_id=lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    activities = lesson_crud.get_activities(db=db, lesson_id=lesson_id)
    return lesson_form_in_database(lesson, activities)