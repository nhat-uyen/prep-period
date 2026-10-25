import json
import logging
from copy import deepcopy
from typing import cast

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

def build_lesson_generation_prompt(request: LessonRequest, db: Session) -> str:
    problem_ids = list(dict.fromkeys(request.problem_ids))
    selected_problems = problem_crud.get_problems_by_ids(db, problem_ids)
    found_ids = {problem.id for problem in selected_problems}
    missing_ids = [problem_id for problem_id in problem_ids if problem_id not in found_ids]

    if missing_ids:
        raise HTTPException(
            status_code=422,
            detail=f"Selected problems were not found: {', '.join(map(str, missing_ids))}",
        )

    selected_problem_data = [
        {
            "question": problem.question,
            "instructions": problem.instructions,
            "answer": problem.answer,
            "explanation": problem.explanation,
            "skills": problem.skills or [],
            "difficulty": problem.difficulty,
            "problem_type": problem.problem_type,
            "reponse_area": problem.response_area,
        }
        for problem in selected_problems
    ]

    return build_prompt(
        topic=request.topic,
        grade=request.grade,
        duration_minutes=request.duration_minutes,
        selected_problems=selected_problem_data,
    )


def generate_lesson_using_ai_service(request: LessonRequest, db: Session):
    logger.info("Generating lesson | Topic: %s, Grade: %s", request.topic, request.grade)

    prompt = build_lesson_generation_prompt(request, db)
    
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
    lesson_json = deepcopy(lesson.lesson_json)
    if not isinstance(lesson_json, dict):
        lesson_json = {}

    lesson_data = {
        "id": lesson.id,
        "topic": lesson.topic,
        "grade": str(lesson.grade),
        "duration_minutes": lesson.duration_minutes,
        **lesson_json,
    }

    # while lesson_json already contain the lesson's activites and problems but we need to get the id for activities and problems because when after saving the lesson, lesson can be edited and changes can be made to the saved activities and problems
    activities = list(reversed(lesson_crud.get_activities(db, lesson_id=cast(int, lesson.id))))
    for activity_index, activity_data in enumerate(lesson_data.get("activities", [])):
        if activity_index >= len(activities):
            continue
        activity_data["id"] = activities[activity_index].id
        saved_problems = problem_crud.get_problems_by_activity(
            db, cast(int, activities[activity_index].id)
        )
        for problem_index, problem_data in enumerate(activity_data.get("problems", [])):
            if problem_index < len(saved_problems):
                problem_data["id"] = saved_problems[problem_index].id
    return lesson_data

def save_lesson_to_databse(db: Session, request: LessonRequest, lesson: LessonResponse):
    saved_lesson = lesson_crud.create_lesson(db=db,
                       topic=request.topic,
                       grade=request.grade,
                       duration_minutes= request.duration_minutes,
                       activities=lesson.activities,
                       lesson_json=lesson.model_dump()  # converts the Pydantic model into a dictionary
    )

    return lesson_form_in_database(db, saved_lesson)

def parse_streamed_lesson(full_response: str) -> LessonResponse:
  try:
    lesson_data = json.loads(repair_latex_escapes(full_response))
    return LessonResponse(**lesson_data)
  
  except (json.JSONDecodeError, ValidationError) as e:
          logger.exception("AI returned invalid JSON.")
          raise ValueError(f"Model returned an invalid lesson data: {e}") from e

def get_lesson(db: Session, lesson_id: int):
    lesson = lesson_crud.get_lesson_by_id(db=db, lesson_id=lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    return lesson_form_in_database(db, lesson)
