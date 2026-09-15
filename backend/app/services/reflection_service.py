from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database import crud
from app.models.reflection import RelfectionRequest


def create_reflection(db: Session, reflection_request : RelfectionRequest):
    return crud.create_reflection(db=db, lesson_id=reflection_request.lesson_id,
                                        objectives_rating=reflection_request.objective_rating,
                                        objectives_notes=reflection_request.objective_notes,
                                        prior_knowledge_rating=reflection_request.prior_knowledge_rating,
                                        prior_knowledge_notes=reflection_request.prior_knowledge_notes,
                                        materials_rating=reflection_request.materials_rating, 
                                        materials_notes=reflection_request.materials_notes,
                                        activities=reflection_request.activities,
                                        keep_notes=reflection_request.keep_notes,
                                        change_notes=reflection_request.change_notes)

def get_reflection(db: Session, lesson_id: int, raise_if_missing: bool = True):
    reflection = crud.get_reflection(db, lesson_id)
    
    if reflection is None and raise_if_missing:
        raise HTTPException(status_code=404, detail="Reflection not found")

    if reflection is None:
        return None
    
    acvitivies = crud.get_activityReflections(db, reflection.id)
    
    reflection_by_id = {
            "id": reflection.id,
            "lesson_id": lesson_id,
    
            "objectives_rating": reflection.objectives_rating,
            "objectives_notes": reflection.objectives_notes,
    
            "prior_knowledge_rating": reflection.prior_knowledge_rating,
            "prior_knowledge_notes": reflection.prior_knowledge_notes,
    
            "materials_rating": reflection.materials_rating,
            "materials_notes": reflection.materials_notes,
    
            "activities": [
                {
                    "activity_index": activity.activity_index,
                    "rating": activity.rating,
                    "notes": activity.notes,
                }
                for activity in acvitivies
            ],
            "keep_notes": reflection.keep_notes,
            "change_notes": reflection.change_notes,
        }
    return reflection_by_id