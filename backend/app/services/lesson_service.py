import json
import logging
from copy import deepcopy

from fastapi import HTTPException
from pydantic_core import ValidationError
from sqlalchemy.orm import Session

from app.llm.ollama_client import generate_response
from app.llm.prompts.lesson_prompt import build_prompt
from app.models.lesson import LessonRequest, LessonResponse
from app.database.models import Lesson as LessonRecord
from app.database import lesson_crud, problem_crud
from app.llm.json_repair import repair_latex_escapes


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

def lesson_form_in_database(db: Session, lesson: LessonRecord):
    lesson_data = {
        "id": lesson.id,
        "subject": lesson.subject,
        "topic": lesson.topic,
        "grade": lesson.grade,
        "duration_minutes": lesson.duration_minutes,
        **deepcopy(lesson.lesson_json),
    }
    activities = list(reversed(lesson_crud.get_activities(db, lesson_id=lesson.id)))
    for activity_index, activity_data in enumerate(lesson_data.get("activities", [])):
        if activity_index >= len(activities):
            continue
        saved_problems = problem_crud.get_problems_by_activity(
            db, activities[activity_index].id
        )
        for problem_index, problem_data in enumerate(activity_data.get("problems", [])):
            if problem_index < len(saved_problems):
                problem_data["id"] = saved_problems[problem_index].id
    return lesson_data

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

    return lesson_form_in_database(db, saved_lesson)

def save_streamed_lesson(db: Session, full_response: str, request: LessonRequest):
  try:

    lesson_data = json.loads(repair_latex_escapes(full_response))
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

    return lesson_form_in_database(db, lesson)
