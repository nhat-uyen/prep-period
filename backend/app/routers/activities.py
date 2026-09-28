from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import lesson_crud
from app.database.database import get_db
from app.database.models import Activity as ActivityRecord
from app.models.lesson import ActivityCreate, ActivityResponse, ActivityUpdate

router = APIRouter(prefix="/activities", tags=["activities"])


def activity_response(activity: ActivityRecord) -> dict:
    return {
        "id": activity.id,
        "lesson_id": activity.lesson_id,
        "name": activity.name,
        "duration_minutes": activity.duration_minutes,
        "teacher_notes_prompts": activity.teacher_notes_prompts,
        "student_instructions": activity.student_instructions,
    }


def ensure_lesson_exists(db: Session, lesson_id: int | None) -> None:
    if lesson_id is not None and lesson_crud.get_lesson_by_id(db, lesson_id) is None:
        raise HTTPException(status_code=404, detail="Lesson not found")


@router.post("", response_model=ActivityResponse, status_code=201)
def create_activity(request: ActivityCreate, db: Session = Depends(get_db)):
    ensure_lesson_exists(db, request.lesson_id)
    activity = lesson_crud.create_activity(db=db, **request.model_dump())
    return activity_response(activity)


@router.get("", response_model=list[ActivityResponse])
def get_activities(
    lesson_id: int | None = None,
    independent_only: bool = False,
    db: Session = Depends(get_db),
):
    if independent_only and lesson_id is not None:
        raise HTTPException(
            status_code=400,
            detail="Choose either lesson_id or independent_only, not both",
        )

    activities = lesson_crud.get_activities(
        db=db,
        lesson_id=lesson_id,
        independent_only=independent_only,
    )
    return [activity_response(activity) for activity in activities]


@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = lesson_crud.get_activity_by_id(db, activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity_response(activity)


@router.patch("/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: int,
    update: ActivityUpdate,
    db: Session = Depends(get_db),
):
    activity_data = update.model_dump(exclude_unset=True)
    if "lesson_id" in activity_data:
        ensure_lesson_exists(db, activity_data["lesson_id"])

    activity = lesson_crud.update_activity(db, activity_id, activity_data)
    if activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity_response(activity)


@router.delete("/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = lesson_crud.delete_activity(db, activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {"message": "Activity deleted successfully"}
