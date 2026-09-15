from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.reflection import RelfectionRequest
from app.services.reflection_service import create_reflection

router = APIRouter(prefix="/reflections", tags=["reflections"])

# POST: create and save reflections
@router.post("")
def create_reflection_with_activities(reflection_request: RelfectionRequest, db: Session = Depends(get_db),
):
    return create_reflection(db, reflection_request)