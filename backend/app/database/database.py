'''
Configuration for the database connection using SQLAlchemy.
'''
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///prep_period.db"

# an SQLAlchemy engine is what holds the connection to the database and using check_same_thread=False allows FastAPI to use the same SQLite database connection in different threads.
# This is necessary as one single request from FastAPI could use multiple threads to handle the request, and SQLite does not allow multiple threads to use the same connection by default.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind= engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()