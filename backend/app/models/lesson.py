from pydantic import BaseModel

class RequestLesson(BaseModel):
    subject: str
    grade: int
    topic: str
    duration_minutes: int

class ResponseLesson(BaseModel):
    subject: str
    topic: str
    objectives: list[str]
    activities: list[str]