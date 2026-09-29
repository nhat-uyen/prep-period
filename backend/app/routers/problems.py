from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import problem_crud
from app.database.database import get_db
from app.models.lesson import ProblemCreate, ProblemResponse

router = APIRouter(prefix="/problems", tags=["problems"])


@router.post("", response_model=ProblemResponse, status_code=201)
def create_problem(request: ProblemCreate, db: Session = Depends(get_db)):
    problem = problem_crud.create_problem(db=db, **request.model_dump())
    return problem


@router.get("", response_model=list[ProblemResponse])
def get_problems(skill: str | None = None, db: Session = Depends(get_db)):
    problems = problem_crud.get_problems(db)
    if skill:
        normalized_skill = skill.strip().casefold()
        problems = [
            problem for problem in problems
            if any(tag.strip().casefold() == normalized_skill for tag in (problem.skills or []))
        ]
    return problems
