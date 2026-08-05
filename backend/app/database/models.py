from sqlalchemy import Column, Integer, String, JSON

from app.database.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)

    subject = Column(String)
    topic = Column(String)
    grade = Column(Integer)
    duration_minutes = Column(Integer)

    lesson_json = Column(JSON)  # Store the lesson content as JSON