from app.database.problem_crud import create_problem
from app.database.skill_crud import get_skills_by_name
from app.routers.skills import get_problems_by_skill


def test_selected_skill_problems_are_returned_in_pages_of_five(db):
    for index in range(12):
        create_problem(
            db,
            question=f"Problem {index}",
            instructions="Solve.",
            answer=str(index),
            explanation="Direct calculation.",
            skills=["Fractions"],
        )

    skill = get_skills_by_name(db, "fractions")[0]
    first_page = get_problems_by_skill(skill.id, 5, 0, db)
    second_page = get_problems_by_skill(skill.id, 5, 5, db)
    last_page = get_problems_by_skill(skill.id, 5, 10, db)

    assert len(first_page.items) == 5
    assert first_page.has_more
    assert len(second_page.items) == 5
    assert second_page.has_more
    assert len(last_page.items) == 2
    assert not last_page.has_more

    problem_ids = [
        problem.id
        for page in (first_page, second_page, last_page)
        for problem in page.items
    ]
    assert len(problem_ids) == len(set(problem_ids))
