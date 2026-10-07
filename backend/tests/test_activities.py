import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
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


class ActivityAssociationTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(bind=self.engine)
        session_factory = sessionmaker(bind=self.engine)
        self.db = session_factory()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_activities_can_be_standalone_or_linked_to_lessons(self):
        lesson = create_lesson(self.db, "Fractions", 5, 45, {}, [])
        standalone = create_activity(
            self.db,
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
            self.db,
            name="Practice",
            duration_minutes=10,
            teacher_notes_prompts=["Watch for misconceptions."],
            student_instructions="Solve the examples.",
            lesson_id=lesson.id,
        )

        self.assertIsNone(standalone.lesson_id)
        self.assertEqual(standalone.teacher_actions, ["Model a fraction"])
        self.assertEqual(standalone.teacher_prompts, ["What does the denominator tell us?"])
        self.assertEqual(standalone.look_fors, ["Labels the parts"])
        self.assertEqual(len(get_problems_by_activity(self.db, standalone.id)), 1)
        self.assertEqual(
            [activity.id for activity in get_activities(self.db, independent_only=True)],
            [standalone.id],
        )
        self.assertEqual(
            [activity.id for activity in get_activities(self.db, lesson_id=lesson.id)],
            [linked.id],
        )

        update_activity(self.db, standalone.id, {"lesson_id": lesson.id})
        self.assertEqual(len(get_activities(self.db, lesson_id=lesson.id)), 2)

        delete_lesson(self.db, lesson.id)
        self.assertTrue(all(activity.lesson_id is None for activity in get_activities(self.db)))

    def test_lesson_creation_persists_problems_for_each_activity(self):
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
        lesson = create_lesson(self.db, "Addition", 2, 30, {}, [activity])
        activity_record = get_activities(self.db, lesson_id=lesson.id)[0]

        saved_problems = get_problems_by_activity(self.db, activity_record.id)

        self.assertEqual(activity_record.teacher_actions, ["Model combining quantities"])
        self.assertEqual(activity_record.teacher_prompts, ["Which operation fits?"])
        self.assertEqual(activity_record.look_fors, ["Identifies both addends"])
        self.assertEqual(len(saved_problems), 1)
        self.assertEqual(saved_problems[0].question, "3 + 4")
        self.assertEqual(saved_problems[0].skills, ["addition"])
        self.assertEqual(saved_problems[0].difficulty, "easy")
        self.assertEqual(saved_problems[0].problem_type, "equation")

    def test_lesson_grade_accepts_text(self):
        request = LessonRequest(
            topic="Algebra",
            grade="GED",
            duration_minutes=45,
        )
        lesson = create_lesson(
            self.db,
            request.topic,
            request.grade,
            request.duration_minutes,
            {"activities": []},
            [],
        )

        saved_lesson = lesson_form_in_database(self.db, lesson)

        self.assertEqual(saved_lesson["grade"], "GED")

    def test_activity_endpoint_saves_and_returns_complete_activity(self):
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
            self.db,
        )

        self.assertEqual(activity["teacher_actions"], ["Demonstrate the first problem"])
        self.assertEqual(activity["teacher_prompts"], ["What strategy applies?"])
        self.assertEqual(activity["look_fors"], ["Explains their choice"])
        self.assertEqual(activity["problems"][0].question, "5 x 3")
