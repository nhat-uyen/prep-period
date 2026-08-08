import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.lessons import home_router, router
from app.database.database import Base, engine


Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(name)s - %(message)s")

app = FastAPI(title="PrepPeriod",
              description="PrepPeriod is an AI tool to assist secondary teachers",
              version="0.1.0")

app.include_router(home_router)
app.include_router(router)

# CORS configuration, backend needs to allow requests from the frontend, which is running on a different origin (http://localhost:5173). This is necessary for the frontend to be able to make API calls to the backend without being blocked by the browser's same-origin policy.
app.add_middleware(CORSMiddleware,
                   allow_origins=["http://localhost:5173"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])