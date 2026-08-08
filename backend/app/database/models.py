from sqlalchemy import Column, DateTime, Integer, String, JSON
from datetime import datetime, timezone
from app.database.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)

    subject = Column(String)
    topic = Column(String)
    grade = Column(Integer)
    duration_minutes = Column(Integer)

    # Store the lesson content as JSON -> this gives the flexibility to modify the lesson structure in the future without needing to change the database schema.
    lesson_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.now(timezone.utc).astimezone)