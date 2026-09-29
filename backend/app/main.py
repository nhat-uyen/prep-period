import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.lessons import home_router, router
from app.routers.reflections import router as reflections_router
from app.routers.activities import router as activities_router
from app.routers.problems import router as problems_router
from app.database.database import Base, engine, migrate_activity_schema, migrate_problem_schema


Base.metadata.create_all(bind=engine)
migrate_problem_schema()
migrate_activity_schema()

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(name)s - %(message)s")

app = FastAPI(title="PrepPeriod",
              description="PrepPeriod is an AI tool to assist secondary teachers",
              version="0.1.0")

app.include_router(home_router)
app.include_router(router)
app.include_router(reflections_router)
app.include_router(activities_router)
app.include_router(problems_router)

# CORS configuration, backend needs to allow requests from the frontend, which is running on a different origin (http://localhost:5173). This is necessary for the frontend to be able to make API calls to the backend without being blocked by the browser's same-origin policy.
app.add_middleware(CORSMiddleware,
                   allow_origins=["http://localhost:5173"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])
