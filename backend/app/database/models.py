from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.database import Base

# this is a table containing all lessons
class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)

    topic = Column(String)
    grade = Column(String)
    duration_minutes = Column(Integer)

    # Store the lesson content as JSON -> this gives the flexibility to modify the lesson structure in the future without needing to change the database schema.
    lesson_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.now(timezone.utc).astimezone)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, nullable=True)

    name = Column(String, nullable=True)
    duration_minutes = Column(Integer, nullable=True)

    teacher_actions = Column(JSON, nullable=False, default=list)
    teacher_prompts = Column(JSON, nullable=False, default=list)
    look_fors = Column(JSON, nullable=False, default=list)
    teacher_notes_prompts= Column(JSON, nullable=True)
    student_instructions = Column(String, nullable=True)

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, nullable=True, index=True)
    activity_id = Column(Integer, nullable=True)
    question = Column(String, nullable=False)
    instructions = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    explanation = Column(String, nullable=False)
    skills = Column(JSON, nullable=False, default=list)
    difficulty = Column(String, nullable=True)
    problem_type = Column(String, nullable=True)

    skill_links = relationship("ProblemSkill", back_populates="problem", cascade="all, delete-orphan")

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

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    normalized_name = Column(String, nullable=False, unique=True, index=True)

    problem_links = relationship("ProblemSkill", back_populates="skill", cascade="all, delete-orphan")

class ProblemSkill(Base):
    __tablename__ = "problem_skills"

    problem_id = Column(Integer, 
                        ForeignKey("problems.id", ondelete="CASCADE"),
                        primary_key=True)
    skill_id = Column(Integer, 
                      ForeignKey("skills.id", ondelete="CASCADE"),
                      primary_key=True)
    # These relationships link problems and skills, names need to be matched back_populates in Problem and Skill
    problem = relationship("Problem", back_populates="skill_links")
    skill = relationship("Skill", back_populates="problem_links")
