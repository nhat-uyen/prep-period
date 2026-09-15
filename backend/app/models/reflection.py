from pydantic import BaseModel

class ActivityReflectionRequest(BaseModel):
    activity_index: int
    rating: int | None = None
    notes: str | None = None

class RelfectionRequest(BaseModel):
    lesson_id: int

    objective_rating: int | None = None
    objective_notes: str | None = None

    prior_knowledge_rating: int | None = None
    prior_knowledge_notes: str | None = None

    materials_rating: int | None = None
    materials_notes: str | None = None

    activities: list[ActivityReflectionRequest] = []

    keep_notes: str | None = None
    change_notes: str | None = None