from sqlalchemy.orm import Session
from typing import cast

from app.database.models import Problem, ProblemSkill, Skill
from app.database import skill_crud
from app.models.pagination_helper import paginate_query


def create_problem(
    db: Session,
    question: str,
    instructions: str,
    answer: str,
    explanation: str,
    skills: list[str] | None = None,
    difficulty: str | None = None,
    problem_type: str | None = None,
    activity_id: int | None = None,
    lesson_id: int | None = None,
) -> Problem:
    problem = Problem(
        lesson_id=lesson_id,
        activity_id=activity_id,
        question=question,
        instructions=instructions,
        answer=answer,
        explanation=explanation,
        skills=[],
        difficulty=difficulty,
        problem_type=problem_type,
    )
    try:
        db.add(problem)
        db.flush()  # Assign the problem ID before persisting its skill links.
        sync_problem_skills(db, problem, skills or [])
        db.commit()
        db.refresh(problem)
        return problem
    except Exception:
        db.rollback()
        raise

# This is not needed anymore since we want to get problems by lessons or skills
# def get_problems(db: Session) -> list[Problem]:
#     return db.query(Problem).order_by(Problem.id.desc()).all()

# Uses in lesson_form_in_datbase
def get_problems_by_activity(db: Session, activity_id: int) -> list[Problem]:
    return (db.query(Problem).filter(Problem.activity_id == activity_id)
            .order_by(Problem.id.asc()).all())

# currently not in used except for testing 
def get_problems_by_lesson(db: Session, lesson_id: int) -> list[Problem]:
    return db.query(Problem).filter(Problem.lesson_id == lesson_id).all()

# fetch one problem by its id
def get_problem_by_id(db: Session, problem_id: int) -> Problem | None:
    return db.query(Problem).filter(Problem.id == problem_id).first()

# uses in lesson_prompt to fetch selected problems for the prompt
def get_problems_by_ids(db: Session, problem_ids: list[int]) -> list[Problem]:
    if not problem_ids:
        return []
    records = db.query(Problem).filter(Problem.id.in_(set(problem_ids))).all()
    records_by_id: dict[int, Problem] = {cast(int, record.id): record for record in records}
    return [records_by_id[problem_id] for problem_id in problem_ids if problem_id in records_by_id]

def update_problem(db: Session, problem_id: int, problem_data: dict[str, object]) -> Problem | None:
    problem = get_problem_by_id(db, problem_id)
    if problem is None:
        return None
    try:
        skills = problem_data.get("skills")
        # Update all fields except skills, which is handled separately with sync_problem_skills.
        for field, value in problem_data.items():
            if field != "skills":
                setattr(problem, field, value)

        if skills is not None:
            sync_problem_skills(db, problem, cast(list[str], skills))

        db.commit()
        db.refresh(problem)
        return problem
    except Exception:
        db.rollback()
        raise


def sync_problem_skills(db: Session, problem: Problem, skill_names: list[str]) -> None:
    """Keep a problem's legacy JSON tags and normalized skill links in sync."""

    # Clean up skill names and create a mapping of normalized names to display names.
    # Example: [" Algebra ", "algebra", "Geometry"] -> {"algebra": "Algebra", "geometry": "Geometry"}
    names_by_normalized: dict[str, str] = {}
    for raw_name in skill_names:
        name = raw_name.strip()
        if name:
            names_by_normalized.setdefault(name.casefold(), name)

    # create a list of just the value, from example above, ["Algebra", "Geometry"]
    setattr(problem, "skills", list(names_by_normalized.values()))

    # from the above example, ["algebra", "geometry"]
    normalized_names = list(names_by_normalized)
    skills_by_normalized: dict[str, Skill] = {}
    if normalized_names:
        skills_by_name = skill_crud.get_skills_by_names(db, normalized_names)
        # from the above example, {"algebra": Skill(id=1, name="add"), "geometry": Skill(id=2, name="triangle")}
        skills_by_normalized = {str(skill.normalized_name): skill for skill in skills_by_name}

    for normalized_name, display_name in names_by_normalized.items():
        if normalized_name not in skills_by_normalized:
            skill = skill_crud.create_skill(db, display_name)
            skills_by_normalized[normalized_name] = skill

    # Flush new Skill rows so their IDs are available for link reconciliation.
    db.flush()
    desired_skill_ids = {skill.id for skill in skills_by_normalized.values()}

    # Keep unchanged links, remove obsolete ones, and add only missing links.
    for link in list(problem.skill_links):
        if link.skill_id not in desired_skill_ids:
            problem.skill_links.remove(link)

    linked_skill_ids = {link.skill_id for link in problem.skill_links}
    for skill in skills_by_normalized.values():
        if skill.id not in linked_skill_ids:
            problem.skill_links.append(ProblemSkill(skill=skill))

# uses for fetching problems of the selected skill in the Browse Skills Tab
def get_problem_by_skill_id(db: Session, skill_id: int, limit: int, offset: int) -> tuple[list[Problem], bool]:
    query = (db.query(Problem)
            .join(ProblemSkill, ProblemSkill.problem_id == Problem.id)
            .filter(ProblemSkill.skill_id == skill_id)
            .order_by(Problem.id.desc()))
    return paginate_query(query, limit=limit, offset=offset)

# used for fetching problems from the skill search in the Browse Skills Tab
# need to limit the skills display
def get_problems_by_skill_ids(db: Session, skill_ids: list[int],) -> dict[int, list[Problem]]:
    if not skill_ids:
        return {}

    results: dict[int, list[Problem]] = {skill_id: [] for skill_id in skill_ids}
    rows = (db.query(ProblemSkill.skill_id, Problem)
            .join(Problem, Problem.id == ProblemSkill.problem_id)
            .filter(ProblemSkill.skill_id.in_(skill_ids))
            .order_by(Problem.id.desc()).all())

    for skill_id, problem in rows:
        results[skill_id].append(problem)
    return results

def delete_problem(db: Session, problem_id: int) -> Problem | None:
    problem = get_problem_by_id(db, problem_id)
    if problem is None:
        return None

    db.delete(problem)
    db.commit()
    return problem

def delete_all_problems(db: Session) -> None:
    db.query(ProblemSkill).delete(synchronize_session=False)
    db.query(Problem).delete()
    db.commit()
