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
        lesson = create_lesson(self.db, "Math", "Fractions", 5, 45, {}, [])
        standalone = create_activity(
            self.db,
            name="Warm-up",
            duration_minutes=5,
            teacher_notes_prompts=[],
            student_instructions="Draw a fraction.",
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
