from fastapi import FastAPI
from app.routes import lessons

app = FastAPI(title="PrepPeriod",
              description="PrepPeriod is an AI tool to assist secondary teachers",
              version="0.1.0")

app.include_router(lessons.router)