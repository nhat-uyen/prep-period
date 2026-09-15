from sqlalchemy.orm import Session
from app.database.models import ActivityReflection, Lesson, Reflection


def create_lesson(db: Session, subject: str, topic: str, grade: int, duration_minutes: int, lesson_json: dict) -> Lesson:
    lesson = Lesson(subject=subject, 
                    topic=topic, 
                    grade=grade, 
                    duration_minutes=duration_minutes, 
                    lesson_json=lesson_json, )
    # add the new lesson to the current database session
    db.add(lesson)
    # write the row into SQLite (without this line, lesson disappears when request ends)
    db.commit()
    # reloads the object from the database; after refresh() lesson assigns an id
    db.refresh(lesson)

    return lesson

def get_lessons(db: Session) -> list[Lesson]:
    # Get all lessons in order of the newest first
    return db.query(Lesson).order_by(Lesson.id.desc()).all()

def get_lesson_by_id(db: Session, lesson_id: int) -> Lesson:
    return db.query(Lesson).filter(Lesson.id == lesson_id).first()

def delete_lesson(db: Session, lesson_id: int): 
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()

    if lesson is None:
        return None

    db.delete(lesson)
    db.commit()

    return lesson

def update_lesson(db: Session, lesson_id: int, lesson_data: dict):
    lesson = (db.query(Lesson).filter(Lesson.id == lesson_id).first())

    if lesson is None:
        return None

    lesson.subject = lesson_data["subject"]
    lesson.topic = lesson_data["topic"]
    lesson.grade = lesson_data["grade"]
    lesson.duration_minutes = lesson_data["duration_minutes"]
    lesson.lesson_json = lesson_data["lesson_json"]

    db.commit()
    db.refresh(lesson)

    return lesson

# create, get, and deletre reflections
def create_reflection(db: Session, lesson_id: int, objectives_rating: int, objectives_notes: str, prior_knowledge_rating: int, prior_knowledge_notes: str, materials_rating: int, materials_notes: str, activities: list[dict], keep_notes: str, change_notes: str,) :
    reflection = Reflection(lesson_id = lesson_id,
                            objectives_rating = objectives_rating,
                            objectives_notes = objectives_notes,
                            prior_knowledge_rating = prior_knowledge_rating, 
                            prior_knowledge_notes = prior_knowledge_notes,
                            materials_rating = materials_rating,
                            materials_notes = materials_notes,
                            keep_notes = keep_notes,
                            change_notes = change_notes)

    db.add(reflection)
    db.commit()
    db.refresh(reflection)

    for activity in activities:
        activity_reflection = ActivityReflection(reflection_id=reflection.id,
                            activity_index=activity.activity_index,
                            rating=activity.rating,
                            notes=activity.notes)
        db.add(activity_reflection)
    db.commit()
    return {"message": "reflection saved successfully", "reflection_id": reflection.id}

# when looking at past lessons, if lessons have reflection, reflection will be shown as well
def get_reflection(db: Session, lesson_id: int) -> Reflection:
    return db.query(Reflection).filter(Reflection.lesson_id == lesson_id).first()

def get_activityReflections(db: Session, reflection_id: int) -> list[ActivityReflection]:
    return db.query(ActivityReflection).filter(ActivityReflection.reflection_id == reflection_id).all()

def delete_reflection(db: Session, lesson_id: int):
    reflection = db.query(Reflection).filter(Reflection.lesson_id == lesson_id).first()

    if reflection is None:
        return None

    db.delete(reflection)
    db.commit()

    return reflection

def delete_activityReflections(db: Session, reflection_id: int):
    activity_reflections = db.query(ActivityReflection).filter( ActivityReflection.reflection_id == reflection_id).all()

    for activity_reflection in activity_reflections:
        db.delete(activity_reflection)
    db.commit()

    return activity_reflections

def clear_history(db: Session):
    db.query(ActivityReflection).delete()
    db.query(Reflection).delete()
    db.query(Lesson).delete()
    db.commit()