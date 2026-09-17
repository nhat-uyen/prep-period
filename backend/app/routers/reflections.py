from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.reflection import RelfectionRequest
from app.services.reflection_service import create_reflection
from app.database import crud

router = APIRouter(prefix="/reflections", tags=["reflections"])

# POST: create and save reflections
@router.post("")
def create_or_update_reflection(reflection_request: RelfectionRequest, db: Session = Depends(get_db),
):
    reflection = crud.get_reflection(db, reflection_request.lesson_id)
    if reflection is None:
        return create_reflection(db, reflection_request)

    crud.update_reflection(db, reflection.id, {
        "objectives_rating": reflection_request.objectives_rating,
        "objectives_notes": reflection_request.objectives_notes,
        "prior_knowledge_rating": reflection_request.prior_knowledge_rating,
        "prior_knowledge_notes": reflection_request.prior_knowledge_notes,
        "materials_rating": reflection_request.materials_rating,
        "materials_notes": reflection_request.materials_notes,
        "keep_notes": reflection_request.keep_notes,
        "change_notes": reflection_request.change_notes,
    })
    crud.update_activity_reflection(db, reflection.id, reflection_request.activities)

    db.refresh(reflection)
    return {"message": "reflection updated successfully", "reflection_id": reflection.id}
