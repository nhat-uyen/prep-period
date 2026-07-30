from fastapi import APIRouter
from app.models.lesson import LessonPlan

router = APIRouter()

@router.get("/")
def home():
    return {
        "message": "Welcome to PrepPeriod!"
    }

@router.post("/lesson_plan")
def create_lesson_plan(request: LessonPlan):

    lesson_plan = {
        "title": f"{request.subject} Lesson",
        "subject": request.subject,
        "grade": request.grade,
        "duration": f"{request.duration_minutes} minutes",
        "by the end of the lesson...": (
            f"Students will understand the key concepts of {request.topic}."
        ),
        "in-class activities": [
            "Warm-up activity",
            "Teacher modeling and explanation",
            "Guided practice",
            "Independent practice",
            "Assessment and feedback"
        ]
    }
    return lesson_plan