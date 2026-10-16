from sqlalchemy.orm import Session

from app.database.models import Skill

def get_all_skills(db: Session) -> list[Skill]:
    return db.query(Skill).all()

def get_skill_by_id(db: Session, skill_id: int) -> Skill | None:
    return db.query(Skill).filter(Skill.id == skill_id).first()

#  using part of a skill's name to search for it
def get_skills_by_name(db: Session, name: str) -> list[Skill]:
    normalized_name = name.strip().casefold()
    return db.query(Skill).filter(Skill.normalized_name.contains(normalized_name)).all()

# assume that the skill does not exist
def create_skill(db: Session, name: str) -> Skill:
        normalized_name = name.strip().casefold()
        skill = Skill(name=name, normalized_name=normalized_name)
        db.add(skill)
        # Flush assigns the ID while leaving commit/rollback to the caller.
        # Problem creation/editing can then persist its skill rows and links
        # atomically with the problem record.
        db.flush()
        return skill

# get multiple skills by their names
def get_skills_by_names(db: Session, names: list[str]) -> list[Skill]:
    normalized_names = [name.strip().casefold() for name in names]
    return db.query(Skill).filter(Skill.normalized_name.in_(normalized_names)).all()

def update_skill(db: Session, skill_id: int, new_name: str) -> Skill | None:
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if skill is None:
        return None
    normalized_name = new_name.strip().casefold()
    setattr(skill, "name", new_name)
    setattr(skill, "normalized_name", normalized_name)
    db.commit()
    db.refresh(skill)
    return skill
