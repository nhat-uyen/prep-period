import pytest
from fastapi import HTTPException

from app.database.lesson_crud import create_activity, create_lesson
from app.database.problem_crud import (
    create_problem,
    delete_problem,
    get_problem_by_id,
    get_problems_by_activity,
    get_problems_by_ids,
    get_problems_by_lesson,
    update_problem,
)
from app.database.skill_crud import get_skills_by_name
from app.models.lesson import LessonRequest, ProblemCreate, ProblemUpdate
from app.routers.problems import create_problem as create_problem_endpoint
from app.routers.problems import delete_problem as delete_problem_endpoint
from app.routers.problems import update_problem as update_problem_endpoint
from app.routers.skills import get_problems_by_skill as get_problems_by_skill_endpoint
from app.services.lesson_service import build_lesson_generation_prompt


class TestProblemAssociations:
    def test_problems_editing(self, db):
        problem = create_problem(
            db,
            question="What is 1/2 + 1/4?",
            instructions="Simplify the expression.",
            answer="3/4",
            explanation="To add these fractions, find a common denominator.",
            skills=["Adding Fractions"],
            difficulty="Medium",
            problem_type="Addition",
        )

        problem_id = problem.id
        updated_problem = ProblemUpdate(question="What is 1/3 + 1/4?", instructions="Simplify the expression.", answer="7/12", explanation="To add these fractions, find a common denominator.", skills=["Adding Fractions"], difficulty="Medium", problem_type="Addition")
        problem = update_problem(db, problem.id, updated_problem.model_dump())

        assert len(get_problems_by_ids(db, [problem.id])) == 1
        saved_problem = get_problem_by_id(db, problem.id)
        assert saved_problem.question == "What is 1/3 + 1/4?"
        assert saved_problem.instructions == "Simplify the expression."
        assert saved_problem.answer == "7/12"
        assert problem.id == problem_id

    def test_problem_keeps_lesson_and_activity_associations_when_updated(self, db):
        lesson = create_lesson(db, "Fractions", "5", 45, {}, [])
        activity = create_activity(
            db,
            name="Practice",
            duration_minutes=10,
            teacher_notes_prompts=[],
            student_instructions="Solve the problem.",
            lesson_id=lesson.id,
        )
        problem = create_problem(
            db,
            question="What is 1/2 + 1/4?",
            instructions="Simplify the expression.",
            answer="3/4",
            explanation="Use a common denominator.",
            skills=["Adding Fractions"],
            activity_id=activity.id,
            lesson_id=lesson.id,
        )

        update_problem(
            db,
            problem.id,
            ProblemUpdate(
                question="What is 1/3 + 1/4?",
                instructions="Simplify the expression.",
                answer="7/12",
                explanation="Use a common denominator.",
                skills=["Adding Fractions"],
            ).model_dump(),
        )

        assert [item.id for item in get_problems_by_activity(db, activity.id)] == [problem.id]
        assert [item.id for item in get_problems_by_lesson(db, lesson.id)] == [problem.id]
        assert get_problem_by_id(db, problem.id).activity_id == activity.id
        assert get_problem_by_id(db, problem.id).lesson_id == lesson.id

    def test_problem_removal(self, db):
        problem = create_problem(
            db,
            question="What is 1/2 + 1/4?",
            instructions="Simplify the expression.",
            answer="3/4",
            explanation="To add these fractions, find a common denominator.",
            skills=["Adding Fractions"],
            difficulty="Medium",
            problem_type="Addition",
        )
        problem_id = problem.id

        removed_problem = delete_problem(db, problem_id)

        assert removed_problem is not None
        assert delete_problem(db, problem_id) is None
        assert get_problems_by_ids(db, [problem_id]) == []
        assert get_problem_by_id(db, problem_id) is None

    def test_library_problem_lifecycle_updates_browse_and_selection(self, db):
        created_problem = create_problem_endpoint(
            ProblemCreate(
                question="What is 2/3 + 1/6?",
                instructions="Add and simplify the fractions.",
                answer="5/6",
                explanation="Rewrite 2/3 as 4/6, then add.",
                skills=["Adding Fractions"],
            ),
            db,
        )
        problem_id = created_problem.id

        skill = get_skills_by_name(db, "adding fractions")[0]
        first_page = get_problems_by_skill_endpoint(skill.id, 5, 0, db)
        assert problem_id in [problem.id for problem in first_page.items]

        updated_problem = update_problem_endpoint(
            problem_id,
            ProblemUpdate(
                question="What is 2/3 + 1/3?",
                instructions="Add and simplify the fractions.",
                answer="1",
                explanation="The fractions have a common denominator.",
                skills=["Adding Fractions"],
            ),
            db,
        )
        browsed_problem = get_problems_by_skill_endpoint(skill.id, 5, 0, db).items[0]
        assert browsed_problem.question == updated_problem.question
        assert browsed_problem.answer == "1"
        assert get_problems_by_ids(db, [problem_id])[0].question == "What is 2/3 + 1/3?"

        delete_problem_endpoint(problem_id, db)

        assert get_problems_by_skill_endpoint(skill.id, 5, 0, db).items == []
        assert get_problems_by_ids(db, [problem_id]) == []

    def test_selected_saved_problems_are_in_generation_prompt(self, db):
        problem = create_problem(
            db,
            question="What is 2/3 + 1/6?",
            instructions="Add and simplify the fractions.",
            answer="5/6",
            explanation="Rewrite 2/3 as 4/6, then add.",
            skills=["Adding Fractions"],
        )
        request = LessonRequest(
            topic="Adding fractions",
            grade="5",
            duration_minutes=45,
            problem_ids=[problem.id],
        )

        prompt = build_lesson_generation_prompt(request, db)

        assert problem.question in prompt
        assert problem.answer in prompt
        assert "Include every selected problem exactly once" in prompt

    def test_generation_prompt_is_built_without_selected_problems(self, db):
        request = LessonRequest(
            topic="Linear equations",
            grade="8",
            duration_minutes=45,
        )

        prompt = build_lesson_generation_prompt(request, db)

        assert "Topic: Linear equations" in prompt
        assert "You are Prep_Period, a math teaching assistant." in prompt

    def test_generation_rejects_missing_selected_problem_ids(self, db):
        request = LessonRequest(
            topic="Adding fractions",
            grade="5",
            duration_minutes=45,
            problem_ids=[999],
        )

        with pytest.raises(HTTPException) as error:
            build_lesson_generation_prompt(request, db)

        assert error.value.status_code == 422

    def test_problem_routes_return_404_when_problem_is_missing(self, db):
        update_request = ProblemUpdate(
            question="What is 1/2 + 1/4?",
            instructions="Simplify the expression.",
            answer="3/4",
            explanation="Use a common denominator.",
            skills=["Adding Fractions"],
        )

        with pytest.raises(HTTPException) as update_error:
            update_problem_endpoint(999, update_request, db)
        assert update_error.value.status_code == 404

        with pytest.raises(HTTPException) as delete_error:
            delete_problem_endpoint(999, db)
        assert delete_error.value.status_code == 404
