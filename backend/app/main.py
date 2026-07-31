from fastapi import FastAPI
from app.routers.lessons import lessons_router, home_router

app = FastAPI(title="PrepPeriod",
              description="PrepPeriod is an AI tool to assist secondary teachers",
              version="0.1.0")
app.include_router(home_router)
app.include_router(lessons_router)