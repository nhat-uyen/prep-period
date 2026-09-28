from sqlalchemy.orm import Session

from app.database.models import ActivityReflection, Reflection


def create_reflection(
    db: Session,
    lesson_id: int,
    objectives_rating: int | None,
    objectives_notes: str | None,
    prior_knowledge_rating: int | None,
    prior_knowledge_notes: str | None,
    materials_rating: int | None,
    materials_notes: str | None,
    activities: list,
    keep_notes: str | None,
    change_notes: str | None,
) -> Reflection:
    reflection = Reflection(
        lesson_id=lesson_id,
        objectives_rating=objectives_rating,
        objectives_notes=objectives_notes,
        prior_knowledge_rating=prior_knowledge_rating,
        prior_knowledge_notes=prior_knowledge_notes,
        materials_rating=materials_rating,
        materials_notes=materials_notes,
        keep_notes=keep_notes,
        change_notes=change_notes,
    )
    db.add(reflection)
    db.flush()

    for activity in activities:
        db.add(
            ActivityReflection(
                reflection_id=reflection.id,
                activity_index=activity.activity_index,
                rating=activity.rating,
                notes=activity.notes,
            )
        )

    db.commit()
    db.refresh(reflection)
    return {"message": "reflection saved successfully", "reflection_id": reflection.id}


def get_reflection(db: Session, lesson_id: int) -> Reflection | None:
    return db.query(Reflection).filter(Reflection.lesson_id == lesson_id).first()


def get_activity_reflections(db: Session, reflection_id: int) -> list[ActivityReflection]:
    return (db.query(ActivityReflection).filter(ActivityReflection.reflection_id == reflection_id).all())


def update_reflection(
    db: Session, reflection_id: int, reflection_data: dict
) -> Reflection | None:
    reflection = db.query(Reflection).filter(Reflection.id == reflection_id).first()
    if reflection is None:
        return None

    reflection.objectives_rating = reflection_data["objectives_rating"]
    reflection.objectives_notes = reflection_data["objectives_notes"]
    reflection.prior_knowledge_rating = reflection_data["prior_knowledge_rating"]
    reflection.prior_knowledge_notes = reflection_data["prior_knowledge_notes"]
    reflection.materials_rating = reflection_data["materials_rating"]
    reflection.materials_notes = reflection_data["materials_notes"]
    reflection.keep_notes = reflection_data["keep_notes"]
    reflection.change_notes = reflection_data["change_notes"]

    db.commit()
    db.refresh(reflection)
    return reflection


def update_activity_reflection(
    db: Session, reflection_id: int, activities: list
) -> list[ActivityReflection]:
    existing_activities = get_activity_reflections(db, reflection_id)
    activity_by_index = {item.activity_index: item for item in activities}
    existing_indexes = {activity.activity_index for activity in existing_activities}

    for activity in existing_activities:
        update_activity = activity_by_index.get(activity.activity_index)
        if update_activity is not None:
            activity.rating = update_activity.rating
            activity.notes = update_activity.notes

    for update_activity in activities:
        if update_activity.activity_index not in existing_indexes:
            db.add(
                ActivityReflection(
                    reflection_id=reflection_id,
                    activity_index=update_activity.activity_index,
                    rating=update_activity.rating,
                    notes=update_activity.notes,
                )
            )

    db.commit()
    return get_activity_reflections(db, reflection_id)


def delete_reflection(db: Session, lesson_id: int) -> Reflection | None:
    reflection = get_reflection(db, lesson_id)
    if reflection is None:
        return None

    db.delete(reflection)
    db.commit()
    return reflection


def delete_activity_reflections(
    db: Session, reflection_id: int
) -> list[ActivityReflection]:
    activity_reflections = get_activity_reflections(db, reflection_id)
    for activity_reflection in activity_reflections:
        db.delete(activity_reflection)
    db.commit()
    return activity_reflections
