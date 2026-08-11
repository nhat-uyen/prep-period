from sqlalchemy.orm import Session
from app.database.models import Lesson


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