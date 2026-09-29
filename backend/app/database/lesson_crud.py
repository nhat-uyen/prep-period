from sqlalchemy.orm import Session

from app.database.models import (
    Activity as ActivityRecord,
    ActivityReflection,
    Lesson,
    Problem as ProblemRecord,
    Reflection,
)
from app.models.lesson import Activity as LessonActivity, Problem as LessonProblem

#  ActivityRecord is the database model for activities
#  LessonActivity is the pydantic model for activities within a lesson
#  lessoon_json does not contain activity data

def _add_activity(
    db: Session,
    lesson_id: int | None,
    name: str,
    duration_minutes: int,
    teacher_notes_prompts: list[str],
    student_instructions: str,
    teacher_actions: list[str] | None = None,
    teacher_prompts: list[str] | None = None,
    look_fors: list[str] | None = None,
) -> ActivityRecord:
    activity = ActivityRecord(
        lesson_id=lesson_id,
        name=name,
        duration_minutes=duration_minutes,
        teacher_actions=teacher_actions if teacher_actions is not None else [],
        teacher_prompts=teacher_prompts if teacher_prompts is not None else [],
        look_fors=look_fors if look_fors is not None else [],
        teacher_notes_prompts=teacher_notes_prompts,
        student_instructions=student_instructions,
    )
    db.add(activity)
    return activity

#  for adding activities independently and not linked to a lesson
def create_activity(
    db: Session,
    name: str,
    duration_minutes: int,
    teacher_notes_prompts: list[str],
    student_instructions: str,
    lesson_id: int | None = None,
    teacher_actions: list[str] | None = None,
    teacher_prompts: list[str] | None = None,
    look_fors: list[str] | None = None,
    problems: list[LessonProblem] | None = None,
) -> ActivityRecord:
    activity = _add_activity(
        db=db,
        lesson_id=lesson_id,
        name=name,
        duration_minutes=duration_minutes,
        teacher_notes_prompts=teacher_notes_prompts,
        student_instructions=student_instructions,
        teacher_actions=teacher_actions,
        teacher_prompts=teacher_prompts,
        look_fors=look_fors,
    )
    db.flush()
    _add_problems_to_activity(db, activity, problems or [])
    db.commit()
    db.refresh(activity)
    return activity


def create_lesson(
    db: Session,
    subject: str,
    topic: str,
    grade: int,
    duration_minutes: int,
    lesson_json: dict,
    activities: list[LessonActivity]
) -> Lesson:
    lesson = Lesson(
        subject=subject,
        topic=topic,
        grade=grade,
        duration_minutes=duration_minutes,
        lesson_json=lesson_json,
    )
    db.add(lesson)
    db.flush()

    for activity in activities:
        activity_record = _add_activity(
            db=db,
            lesson_id=lesson.id,
            name=activity.name,
            duration_minutes=activity.duration_minutes,
            teacher_notes_prompts=activity.teacher_notes_prompts,
            student_instructions=activity.student_instructions,
            teacher_actions=activity.teacher_actions,
            teacher_prompts=activity.teacher_prompts,
            look_fors=activity.look_fors,
        )
        db.flush()

        _add_problems_to_activity(db, activity_record, activity.problems)

    db.commit()
    db.refresh(lesson)
    return lesson


def _add_problems_to_activity(db: Session, activity: ActivityRecord, problems: list[LessonProblem],) -> None:
    for problem in problems:
        db.add(ProblemRecord(
            lesson_id=activity.lesson_id,
            activity_id=activity.id,
            **problem.model_dump(),
        ))


def get_activities(
    db: Session,
    lesson_id: int | None = None,
    independent_only: bool = False,
) -> list[ActivityRecord]:
    query = db.query(ActivityRecord)
    if independent_only:
        query = query.filter(ActivityRecord.lesson_id.is_(None))
    elif lesson_id is not None:
        query = query.filter(ActivityRecord.lesson_id == lesson_id)
    return query.order_by(ActivityRecord.id.desc()).all()


def get_activity_by_id(db: Session, activity_id: int) -> ActivityRecord | None:
    return db.query(ActivityRecord).filter(ActivityRecord.id == activity_id).first()


def update_activity(
    db: Session,
    activity_id: int,
    activity_data: dict,
) -> ActivityRecord | None:
    activity = get_activity_by_id(db, activity_id)
    if activity is None:
        return None

    problems = activity_data.pop("problems", None)
    for field, value in activity_data.items():
        setattr(activity, field, value)

    if "lesson_id" in activity_data and problems is None:
        db.query(ProblemRecord).filter(ProblemRecord.activity_id == activity_id).update(
            {ProblemRecord.lesson_id: activity_data["lesson_id"]},
            synchronize_session=False,
        )
    elif problems is not None:
        db.query(ProblemRecord).filter(ProblemRecord.activity_id == activity_id).delete(
            synchronize_session=False
        )
        _add_problems_to_activity(db, activity, problems)

    db.commit()
    db.refresh(activity)
    return activity


def delete_activity(db: Session, activity_id: int) -> ActivityRecord | None:
    activity = get_activity_by_id(db, activity_id)
    if activity is None:
        return None

    db.query(ProblemRecord).filter(ProblemRecord.activity_id == activity_id).update(
        {ProblemRecord.lesson_id: None, ProblemRecord.activity_id: None},
        synchronize_session=False,
    )
    db.delete(activity)
    db.commit()
    return activity


def get_lessons(db: Session) -> list[Lesson]:
    return db.query(Lesson).order_by(Lesson.id.desc()).all()


def get_lesson_by_id(db: Session, lesson_id: int) -> Lesson | None:
    return db.query(Lesson).filter(Lesson.id == lesson_id).first()


def delete_lesson(db: Session, lesson_id: int) -> Lesson | None:
    lesson = get_lesson_by_id(db, lesson_id)
    if lesson is None:
        return None
    
    if reflection := db.query(Reflection).filter(Reflection.lesson_id == lesson_id).first():
        db.query(ActivityReflection).filter(ActivityReflection.reflection_id == reflection.id).delete(synchronize_session=False)
        db.delete(reflection)
  
    db.delete(lesson)
    db.commit()
    return lesson


def update_lesson(db: Session, lesson_id: int, lesson_data: dict) -> Lesson | None:
    lesson = get_lesson_by_id(db, lesson_id)
    if lesson is None:
        return None

    lesson.subject = lesson_data["subject"]
    lesson.topic = lesson_data["topic"]
    lesson.grade = lesson_data["grade"]
    lesson.duration_minutes = lesson_data["duration_minutes"]
    lesson.lesson_json = lesson_data["lesson_json"]

    db.commit()
    db.refresh(lesson)
    return lesson


def clear_history(db: Session) -> None:
    db.query(ActivityReflection).delete()
    db.query(Reflection).delete()
    db.query(Lesson).delete()
    db.commit()
