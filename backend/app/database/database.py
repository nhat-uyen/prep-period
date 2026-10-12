'''
Configuration for the database connection using SQLAlchemy.
'''
from sqlalchemy import create_engine, inspect, text, select
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

def migrate_problem_skills():
    from app.database.models import Problem, ProblemSkill, Skill

    # create_all() will not repair a table that was created with an older,
    # incomplete schema. Preserve that table, then create the current schema.
    Base.metadata.create_all(
        bind=engine,
        tables=[Skill.__table__, ProblemSkill.__table__],
    )

    # Use an ORM Session for mapped objects and commit the backfill as a unit.
    with SessionLocal() as db:
        try:
            skills_by_name = {
                skill.normalized_name: skill
                for skill in db.scalars(select(Skill)).all()
            }
            existing_links = set(db.execute(select(ProblemSkill.problem_id, ProblemSkill.skill_id)).all())

            for problem in db.scalars(select(Problem)).all():
                raw_skills = problem.skills
                if not isinstance(raw_skills, list):
                    continue

                for raw_name in raw_skills:
                    if not isinstance(raw_name, str):
                        continue

                    name = raw_name.strip()
                    if not name:
                        continue

                    normalized_name = name.casefold()
                    skill = skills_by_name.get(normalized_name)
                    if skill is None:
                        skill = Skill(name=name, normalized_name=normalized_name)
                        db.add(skill)
                        db.flush()
                        skills_by_name[normalized_name] = skill

                    link_key = (problem.id, skill.id)
                    if link_key not in existing_links:
                        db.add(
                            ProblemSkill(problem_id=problem.id, skill_id=skill.id,)
                        )
                        existing_links.add(link_key)

            db.commit()
        except Exception:
            db.rollback()
            raise

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
