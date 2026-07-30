from pydantic import BaseModel

class LessonPlan(BaseModel):
    subject: str
    grade: int
    topic: str
    duration_minutes: int