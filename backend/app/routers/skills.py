from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database import skill_crud
from app.models.lesson import ProblemResponse
from app.database import problem_crud


router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/")
def get_skills(db: Session = Depends(get_db)):
    skills = skill_crud.get_all_skills(db)
    for skill in skills:
        skill.id = skill.id
        skill.name = skill.name.capitalize()
        skill.normalized_name = skill.normalized_name.strip()
    return skills

@router.get("/{skill_id}/problems", response_model=list[ProblemResponse])
def get_problems_by_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = skill_crud.get_skill_by_id(db, skill_id)
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.problem_links is None or len(skill.problem_links) == 0:
        return []
    problems = problem_crud.get_problem_by_skill_id(db, skill_id)
    return problems

# This is called after skills have been filtered by their names
# filtered skills already have id, name, and normalized_name set correctly
# this will call the their problem links to retrieve the associated problems
# can this return a problem list for one skill?
@router.get("/search", response_model=list[tuple[str, list[ProblemResponse]]])
def get_problems_by_skill_names(skill_name: str, db: Session = Depends(get_db)):
    skills = skill_crud.get_skills_by_name(db, skill_name)
    problems_by_skill = problem_crud.get_problems_by_skill_ids(db, [skill.id for skill in skills])
    return [(skill.name, problems_by_skill[skill.id]) for skill in skills]
