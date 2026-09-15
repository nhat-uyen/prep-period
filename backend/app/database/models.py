from sqlalchemy import Column, DateTime, Integer, String, Text, JSON
from datetime import datetime, timezone
from app.database.database import Base

# this is a table containing all lessons
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

# this table contains all the reflections
class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, nullable=False)

    objectives_rating = Column(Integer, nullable=True)
    objectives_notes = Column(Text, nullable=True)

    prior_knowledge_rating = Column(Integer, nullable=True)
    prior_knowledge_notes = Column(Text, nullable=True)

    materials_rating = Column(Integer, nullable=True)
    materials_notes = Column(Text, nullable=True)

    keep_notes = Column(Text, nullable=True)
    change_notes = Column(Text, nullable=True)

class ActivityReflection(Base):
    __tablename__ = "activity_reflection"

    id = Column(Integer, primary_key=True)
    reflection_id = Column(Integer, nullable=False)

    activity_index = Column(Integer, nullable=True)
    rating = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)