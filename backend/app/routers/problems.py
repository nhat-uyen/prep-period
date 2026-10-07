from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import problem_crud
from app.database.database import get_db
from app.models.lesson import ProblemCreate, ProblemResponse, ProblemUpdate

router = APIRouter(prefix="/problems", tags=["problems"])


@router.post("", response_model=ProblemResponse, status_code=201)
def create_problem(request: ProblemCreate, db: Session = Depends(get_db)):
    problem = problem_crud.create_problem(db=db, **request.model_dump())
    return problem


@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(problem_id: int, request: ProblemUpdate, db: Session = Depends(get_db)):
    problem = problem_crud.update_problem(db, problem_id, request.model_dump())
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@router.delete("/{problem_id}", status_code=204)
def delete_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = problem_crud.delete_problem(db, problem_id)
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")


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
