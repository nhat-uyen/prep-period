import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.database.problem_crud import create_problem
from app.database.skill_crud import get_skills_by_name
from app.routers.skills import get_problems_by_skill


class SkillProblemPaginationTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(self.engine)
        self.db = sessionmaker(bind=self.engine)()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()

    def test_selected_skill_problems_are_returned_in_pages_of_five(self):
        for index in range(12):
            create_problem(
                self.db,
                question=f"Problem {index}",
                instructions="Solve.",
                answer=str(index),
                explanation="Direct calculation.",
                skills=["Fractions"],
            )

        skill = get_skills_by_name(self.db, "fractions")[0]
        first_page = get_problems_by_skill(skill.id, 5, 0, self.db)
        second_page = get_problems_by_skill(skill.id, 5, 5, self.db)
        last_page = get_problems_by_skill(skill.id, 5, 10, self.db)

        self.assertEqual(len(first_page.items), 5)
        self.assertTrue(first_page.has_more)
        self.assertEqual(len(second_page.items), 5)
        self.assertTrue(second_page.has_more)
        self.assertEqual(len(last_page.items), 2)
        self.assertFalse(last_page.has_more)

        problem_ids = [
            problem.id
            for page in (first_page, second_page, last_page)
            for problem in page.items
        ]
        self.assertEqual(len(problem_ids), len(set(problem_ids)))
