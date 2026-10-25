from app.database.lesson_crud import (
    create_activity,
    create_lesson,
    delete_lesson,
    get_activities,
    update_activity,
)
from app.database.problem_crud import get_problems_by_activity
from app.models.lesson import Activity, ActivityCreate, LessonRequest, Problem
from app.routers.activities import create_activity as create_activity_endpoint
from app.services.lesson_service import lesson_form_in_database


def test_activities_can_be_standalone_or_linked_to_lessons(db):
    lesson = create_lesson(db, "Fractions", 5, 45, {}, [])
    standalone = create_activity(
        db,
        name="Warm-up",
        duration_minutes=5,
        teacher_notes_prompts=[],
        student_instructions="Draw a fraction.",
        teacher_actions=["Model a fraction"],
        teacher_prompts=["What does the denominator tell us?"],
        look_fors=["Labels the parts"],
        problems=[
            Problem(
                question="What is one half of 8?",
                instructions="Split 8 into 2 equal groups.",
                answer="4",
                explanation="Each group contains 4.",
                skills=["halving"],
            )
        ],
    )
    linked = create_activity(
        db,
        name="Practice",
        duration_minutes=10,
        teacher_notes_prompts=["Watch for misconceptions."],
        student_instructions="Solve the examples.",
        lesson_id=lesson.id,  # type: ignore
    )

    assert standalone.lesson_id is None
    assert standalone.teacher_actions == ["Model a fraction"]
    assert standalone.teacher_prompts == ["What does the denominator tell us?"]
    assert standalone.look_fors == ["Labels the parts"]
    assert len(get_problems_by_activity(db, standalone.id)) == 1  # type: ignore
    assert [activity.id for activity in get_activities(db, independent_only=True)] == [
        standalone.id
    ]
    assert [activity.id for activity in get_activities(db, lesson_id=lesson.id)] == [linked.id]

    update_activity(db, standalone.id, {"lesson_id": lesson.id})
    assert len(get_activities(db, lesson_id=lesson.id)) == 2

    delete_lesson(db, lesson.id)
    assert all(activity.lesson_id is None for activity in get_activities(db))


def test_lesson_creation_persists_problems_for_each_activity(db):
    activity = Activity(
        name="Practice",
        duration_minutes=10,
        teacher_actions=["Model combining quantities"],
        teacher_prompts=["Which operation fits?"],
        look_fors=["Identifies both addends"],
        teacher_notes_prompts=[],
        student_instructions="Solve each problem.",
        problems=[
            Problem(
                question="3 + 4",
                instructions="Combine the quantities.",
                answer="7",
                explanation="Three plus four equals seven.",
                skills=["addition"],
                difficulty="easy",
                problem_type="equation",
            )
        ],
    )
    lesson = create_lesson(db, "Addition", 2, 30, {}, [activity])
    activity_record = get_activities(db, lesson_id=lesson.id)[0]

    saved_problems = get_problems_by_activity(db, activity_record.id)

    assert activity_record.teacher_actions == ["Model combining quantities"]
    assert activity_record.teacher_prompts == ["Which operation fits?"]
    assert activity_record.look_fors == ["Identifies both addends"]
    assert len(saved_problems) == 1
    assert saved_problems[0].question == "3 + 4"
    assert saved_problems[0].skills == ["addition"]
    assert saved_problems[0].difficulty == "easy"
    assert saved_problems[0].problem_type == "equation"


def test_lesson_grade_accepts_text(db):
    request = LessonRequest(
        topic="Algebra",
        grade="GED",
        duration_minutes=45,
    )
    lesson = create_lesson(
        db,
        request.topic,
        request.grade,
        request.duration_minutes,
        {"activities": []},
        [],
    )

    saved_lesson = lesson_form_in_database(db, lesson)

    assert saved_lesson["grade"] == "GED"


def test_activity_endpoint_saves_and_returns_complete_activity(db):
    activity = create_activity_endpoint(
        ActivityCreate(
            name="Independent practice",
            duration_minutes=15,
            teacher_actions=["Demonstrate the first problem"],
            teacher_prompts=["What strategy applies?"],
            look_fors=["Explains their choice"],
            teacher_notes_prompts=["Record common errors"],
            student_instructions="Solve each question.",
            problems=[
                Problem(
                    question="5 x 3",
                    instructions="Count 5 groups of 3.",
                    answer="15",
                    explanation="Five groups of three total fifteen.",
                    skills=["multiplication"],
                )
            ],
        ),
        db,
    )

    assert activity["teacher_actions"] == ["Demonstrate the first problem"]
    assert activity["teacher_prompts"] == ["What strategy applies?"]
    assert activity["look_fors"] == ["Explains their choice"]
    assert activity["problems"][0].question == "5 x 3"
