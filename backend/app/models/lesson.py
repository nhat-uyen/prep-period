from pydantic import BaseModel

class LessonRequest(BaseModel):
    subject: str
    topic: str
    grade: int
    duration_minutes: int

class Activity(BaseModel):
    name: str
    duration_minutes: int
    instructions: str

class LessonResponse(BaseModel):
    subject: str
    topic: str
    title: str
    objectives: list[str]
    materials: list[str]
    activities: list[Activity]
    assessment_type: str