'''
Configuration for the database connection using SQLAlchemy.
'''
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///prep_period.db"

# an SQLAlchemy engine is what holds the connection to the database and using check_same_thread=False allows FastAPI to use the same SQLite database connection in different threads.
# This is necessary as one single request from FastAPI could use multiple threads to handle the request, and SQLite does not allow multiple threads to use the same connection by default.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind= engine, autoflush=False, autocommit=False)

Base = declarative_base()


def migrate_problem_schema():
    columns = {column["name"] for column in inspect(engine).get_columns("problems")}
    missing_columns = {
        "lesson_id": "INTEGER",
        "activity_id": "INTEGER",
        "difficulty": "VARCHAR",
        "problem_type": "VARCHAR",
    }

    with engine.begin() as connection:
        for column, column_type in missing_columns.items():
            if column not in columns:
                connection.execute(text(f"ALTER TABLE problems ADD COLUMN {column} {column_type}"))


def migrate_activity_schema():
    columns = {column["name"] for column in inspect(engine).get_columns("activities")}
    missing_columns = {
        "teacher_actions": "JSON NOT NULL DEFAULT '[]'",
        "teacher_prompts": "JSON NOT NULL DEFAULT '[]'",
        "look_fors": "JSON NOT NULL DEFAULT '[]'",
    }

    with engine.begin() as connection:
        for column, column_type in missing_columns.items():
            if column not in columns:
                connection.execute(text(f"ALTER TABLE activities ADD COLUMN {column} {column_type}"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
