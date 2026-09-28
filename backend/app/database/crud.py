"""Backward-compatible imports for the domain-specific CRUD modules.

Prefer importing from lesson_crud, problem_crud, or reflection_crud directly.
"""

from app.database.lesson_crud import (
    clear_history,
    create_activity,
    create_lesson,
    delete_lesson,
    get_activities,
    get_lesson_by_id,
    get_lessons,
    update_lesson,
)
from app.database.problem_crud import (
    create_problem,
    delete_problem,
    get_problem_by_id,
    get_problems,
)
from app.database.reflection_crud import (
    create_reflection,
    delete_activity_reflections,
    delete_reflection,
    get_activity_reflections,
    get_reflection,
    update_activity_reflection,
    update_reflection,
)

# Legacy aliases kept for callers that have not migrated yet.
get_activityReflections = get_activity_reflections
delete_activityReflections = delete_activity_reflections
