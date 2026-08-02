from fastapi import APIRouter

from app.models.lesson import RequestLesson
from app.services.lesson_service import generate_lesson_using_ai_service

home_router = APIRouter()
lessons_router = APIRouter(prefix="/lessons", tags=["lessons"])

@home_router.get("/", response_model=None)
def home():
    return {
        "message": "Welcome to PrepPeriod!"
    }

@lessons_router.post("", response_model=None)
def create_lesson_plan(request: RequestLesson):
    return generate_lesson_using_ai_service(request)