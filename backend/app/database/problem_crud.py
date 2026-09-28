from sqlalchemy.orm import Session

from app.database.models import Problem


def create_problem(
    db: Session,
    question: str,
    instructions: str,
    answer: str,
    explanation: str,
    skills: list[str] | None = None,
    difficulty: str | None = None,
    problem_type: str | None = None,
) -> Problem:
    problem = Problem(
        question=question,
        instructions=instructions,
        answer=answer,
        explanation=explanation,
        skills=skills if skills is not None else [],
        difficulty=difficulty,
        problem_type=problem_type,
    )
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem


def get_problems(db: Session) -> list[Problem]:
    return db.query(Problem).all()

def get_problem_by_id(db: Session, problem_id: int) -> Problem | None:
    return db.query(Problem).filter(Problem.id == problem_id).first()

def get_problem_by_skill(db: Session, skill: str) -> list[Problem]:
    return db.query(Problem).filter(Problem.skills.contains(skill)).all()

def delete_problem(db: Session, problem_id: int) -> Problem | None:
    problem = get_problem_by_id(db, problem_id)
    if problem is None:
        return None

    db.delete(problem)
    db.commit()
    return problem
