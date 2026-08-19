import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.lesson import LessonRequest, UpdateLesson, LessonResponse
from app.services.lesson_service import generate_lesson_using_ai_service
from app.database import crud
from app.database.database import get_db


router = APIRouter(prefix="/lessons", tags=["lessons"])
home_router = APIRouter()

@home_router.get("/", response_model=None)
def home():
    return {
        "message": "Welcome to PrepPeriod!"
    }

# POST: create and save lessons
@router.post("")
def create_lesson_plan(request: LessonRequest, db: Session = Depends(get_db)):
    return generate_lesson_using_ai_service(request, db)

# GET: retrive all saved lessons
@router.get("/all")
def get_saved_lessons(db: Session = Depends(get_db)):
    lessons = crud.get_lessons(db)
    all_lessons = [
        {
        "id": lesson.id,
        "subject": lesson.subject,
        "topic": lesson.topic,
        "grade": lesson.grade,
        "duration_minutes": lesson.duration_minutes,
        **lesson.lesson_json
        }
        for lesson in lessons
    ]
    return all_lessons

@router.get("/{lesson_id}")
def get_one_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = crud.get_lesson_by_id(db, lesson_id)

    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    lesson_by_id = {
        "id": lesson.id,
        "subject": lesson.subject,
        "topic": lesson.topic,
        "grade": lesson.grade,
        "duration_minutes": lesson.duration_minutes,
        **lesson.lesson_json
    }
    return lesson_by_id

@router.delete("/{lesson_id}")
def delete_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = crud.delete_lesson(db, lesson_id)

    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    return {
        "message": "Lesson deleted successfully"
    }

@router.put("/{lesson_id}")
def update_lesson(lesson_id: int, update: UpdateLesson, db: Session= Depends(get_db)):
    lesson_data = {
        "subject": update.subject,
        "topic": update.topic,
        "grade": update.grade,
        "duration_minutes": update.duration_minutes,
        "lesson_json": {
            "title": update.title,
            "objectives": update.objectives,
            "prior_knowledge": update.prior_knowledge,
            "materials": update.materials,
            "activities": [activity.model_dump() for activity in update.activities]
        }
    }
    updated_lesson = crud.update_lesson(db=db, lesson_id=lesson_id,
                                        lesson_data=lesson_data)
    
    if updated_lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    lesson = {
        "id": updated_lesson.id,
        "subject": updated_lesson.subject,
        "topic": updated_lesson.topic,
        "grade": updated_lesson.grade,
        "duration_minutes": updated_lesson.duration_minutes,
        **updated_lesson.lesson_json
    }
    return lesson