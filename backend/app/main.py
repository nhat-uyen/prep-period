import logging

from fastapi import FastAPI

from app.routers.lessons import lessons_router, home_router
from app.database.database import Base, engine
from app.database.models import Lesson

Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(name)s - %(message)s")

app = FastAPI(title="PrepPeriod",
              description="PrepPeriod is an AI tool to assist secondary teachers",
              version="0.1.0")
app.include_router(home_router)
app.include_router(lessons_router)