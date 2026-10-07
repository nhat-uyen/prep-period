import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.database.lesson_crud import create_activity, create_lesson
from app.database.problem_crud import (
    create_problem,
    get_problem_by_id,
    get_problems_by_activity,
    get_problems_by_ids,
    get_problems_by_lesson,
    update_problem,
    delete_problem,
)
from app.models.lesson import ProblemUpdate
from app.routers.problems import delete_problem as delete_problem_endpoint
from app.routers.problems import update_problem as update_problem_endpoint


class ProblemAssociationTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        session_factory = sessionmaker(bind=self.engine)
        self.db = session_factory()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()

    def test_problems_editing(self):
        problem = create_problem(self.db, question="What is 1/2 + 1/4?", instructions="Simplify the expression.", 
                  answer="3/4", 
                    explanation="To add these fractions, find a common denominator.", 
                    skills=["Adding Fractions"], difficulty="Medium", problem_type="Addition" )

        problem_id = problem.id
        updated_problem = ProblemUpdate(question="What is 1/3 + 1/4?", instructions="Simplify the expression.", answer="7/12", explanation="To add these fractions, find a common denominator.", skills=["Adding Fractions"], difficulty="Medium", problem_type="Addition")
        problem = update_problem(self.db, problem.id, updated_problem.model_dump())

        self.assertEqual(len(get_problems_by_ids(self.db, [problem.id])), 1)
        saved_problem = get_problem_by_id(self.db, problem.id)
        self.assertEqual(saved_problem.question, "What is 1/3 + 1/4?")
        self.assertEqual(saved_problem.instructions, "Simplify the expression.")
        self.assertEqual(saved_problem.answer, "7/12")
        self.assertEqual(problem.id, problem_id)

    def test_problem_keeps_lesson_and_activity_associations_when_updated(self):
        lesson = create_lesson(self.db, "Fractions", "5", 45, {}, [])
        activity = create_activity(
            self.db,
            name="Practice",
            duration_minutes=10,
            teacher_notes_prompts=[],
            student_instructions="Solve the problem.",
            lesson_id=lesson.id,
        )
        problem = create_problem(
            self.db,
            question="What is 1/2 + 1/4?",
            instructions="Simplify the expression.",
            answer="3/4",
            explanation="Use a common denominator.",
            skills=["Adding Fractions"],
            activity_id=activity.id,
            lesson_id=lesson.id,
        )

        update_problem(
            self.db,
            problem.id,
            ProblemUpdate(
                question="What is 1/3 + 1/4?",
                instructions="Simplify the expression.",
                answer="7/12",
                explanation="Use a common denominator.",
                skills=["Adding Fractions"],
            ).model_dump(),
        )

        self.assertEqual([item.id for item in get_problems_by_activity(self.db, activity.id)], [problem.id])
        self.assertEqual([item.id for item in get_problems_by_lesson(self.db, lesson.id)], [problem.id])
        self.assertEqual(get_problem_by_id(self.db, problem.id).activity_id, activity.id)
        self.assertEqual(get_problem_by_id(self.db, problem.id).lesson_id, lesson.id)

    def test_problem_removal(self):
        problem = create_problem(
            self.db,
            question="What is 1/2 + 1/4?",
            instructions="Simplify the expression.",
            answer="3/4",
            explanation="To add these fractions, find a common denominator.",
            skills=["Adding Fractions"],
            difficulty="Medium",
            problem_type="Addition",
        )
        problem_id = problem.id

        removed_problem = delete_problem(self.db, problem_id)

        self.assertIsNotNone(removed_problem)
        self.assertIsNone(delete_problem(self.db, problem_id))
        self.assertEqual(get_problems_by_ids(self.db, [problem_id]), [])
        self.assertIsNone(get_problem_by_id(self.db, problem_id))

    def test_problem_routes_return_404_when_problem_is_missing(self):
        update_request = ProblemUpdate(
            question="What is 1/2 + 1/4?",
            instructions="Simplify the expression.",
            answer="3/4",
            explanation="Use a common denominator.",
            skills=["Adding Fractions"],
        )

        with self.assertRaises(HTTPException) as update_error:
            update_problem_endpoint(999, update_request, self.db)
        self.assertEqual(update_error.exception.status_code, 404)

        with self.assertRaises(HTTPException) as delete_error:
            delete_problem_endpoint(999, self.db)
        self.assertEqual(delete_error.exception.status_code, 404)
