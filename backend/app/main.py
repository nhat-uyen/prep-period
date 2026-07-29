from fastapi import FastAPI
from pydantic import BaseModel

class LessonPlan(BaseModel):
    subject: str
    grade: int
    topic: str
    duration_minutes: int

app = FastAPI(title="PrepPeriod",
              description="PrepPeriod is an AI tool to assist secondary teachers",
              version="0.1.0")

@app.get("/")
def home():
    return {
        "message": "Welcome to PrepPeriod!"
    }

@app.post("/lesson_plan")
def create_lesson_plan(request: LessonPlan):

    lesson_plan = {
        "title": f"{request.subject} Lesson",
        "subject": request.subject,
        "grade": request.grade,
        "duration": f"{request.duration_minutes} minutes",
        "by the end of the lesson...": (
            f"Students will understand the key concepts of {request.topic}."
        ),
        "activities": [
            "Warm-up activity",
            "Teacher modeling and explanation",
            "Guided practice",
            "Independent practice",
            "Assessment and feedback"
        ]
    }
    return lesson_plan

