import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.models.lesson import LessonRequest, UpdateLesson
from app.services.lesson_service import generate_lesson_using_ai_service, save_streamed_lesson
from app.services.reflection_service import get_reflection
from app.database import crud
from app.database.database import get_db
from app.llm.lesson_prompt import build_prompt
from app.llm.ollama_client import generate_streaming_response

logger = logging.getLogger(__name__)

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

# Streaming endpoint
@router.post('/stream')
def stream_lesson_plan(request: LessonRequest, db: Session = Depends(get_db)):
    prompt = build_prompt(
        subject=request.subject,
        topic=request.topic,
        grade=request.grade,
        duration_minutes=request.duration_minutes,
    )

    def stream():
        full_repsonse = "" 
        for chunk in generate_streaming_response(prompt):
            # each chunk produced is saved in full_repsonse
            full_repsonse += chunk
            # when Ollama produces chunk of respsonse, this send chunk to React
            yield chunk

        # happen when Ollama finishes streaming the repsonse
        save_streamed_lesson(db,full_repsonse, request)
        logger.info("Successfully save to database")
        
    return StreamingResponse(stream(), media_type="text/plain")

# GET: retrive all saved lessons
@router.get("/all")
def get_saved_lessons(db: Session = Depends(get_db)):
    lessons = crud.get_lessons(db)
    all_lessons = []

    for lesson in lessons:
        lesson_by_id = {
        "id": lesson.id,
        "subject": lesson.subject,
        "topic": lesson.topic,
        "grade": lesson.grade,
        "duration_minutes": lesson.duration_minutes,
        **lesson.lesson_json
        }
        reflection = get_reflection(db, lesson.id, raise_if_missing=False)
        lesson_by_id["reflection"] = reflection

        all_lessons.append(lesson_by_id)
    
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

    reflection = get_reflection(db, lesson.id, raise_if_missing=False)

    lesson_by_id["reflection"] = reflection

    return lesson_by_id

@router.delete("/clear")
def clear_lessons(db: Session = Depends(get_db)):
    crud.clear_history(db=db)
    return {"message": "Lesson history cleared"}

@router.delete("/{lesson_id}")
def delete_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = crud.delete_lesson(db, lesson_id)

    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    return { "message": "Lesson deleted successfully" }

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