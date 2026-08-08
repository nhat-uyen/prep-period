from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.lesson import LessonRequest, LessonResponse
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
@router.post("", response_model=LessonResponse)
def create_lesson_plan(request: LessonRequest, db: Session = Depends(get_db)):
    return generate_lesson_using_ai_service(request, db)

# GET: retrive all saved lessons
@router.get("/all")
def get_saved_lessons(db: Session = Depends(get_db)):
    return crud.get_lessons(db)

@router.get("/{lesson_id}")
def get_one_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = crud.get_lesson_by_id(db, lesson_id)

    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return lesson