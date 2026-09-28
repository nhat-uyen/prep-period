from pydantic import BaseModel, Field

class LessonRequest(BaseModel):
    subject: str
    topic: str
    grade: int
    duration_minutes: int

class Problem(BaseModel):
    question: str
    instructions: str
    answer: str
    explanation: str
    skills: list[str]

class Activity(BaseModel):
    name: str
    duration_minutes: int

    # Teacher
    teacher_actions: list[str]
    teacher_prompts: list[str]
    look_fors: list[str]
    teacher_notes_prompts: list[str]

    # Student
    student_instructions: str
    problems: list[Problem]

class ActivityCreate(BaseModel):
    lesson_id: int | None = None
    name: str
    duration_minutes: int
    teacher_notes_prompts: list[str] = Field(default_factory=list)
    student_instructions: str

class ActivityUpdate(BaseModel):
    lesson_id: int | None = None
    name: str | None = None
    duration_minutes: int | None = None
    teacher_notes_prompts: list[str] | None = None
    student_instructions: str | None = None

class ActivityResponse(BaseModel):
    id: int
    lesson_id: int | None
    name: str | None
    duration_minutes: int | None
    teacher_notes_prompts: list[str] | None
    student_instructions: str | None

class LessonResponse(BaseModel):
    title: str
    objectives: list[str]
    prior_knowledge: list[str]
    materials: list[str]
    activities: list[Activity]

class SavedLesson (BaseModel):
    id: int
    subject: str
    topic: str
    grade: int
    duration_minutes: int
    title: str
    objectives: list[str]
    prior_knowledge: list[str]
    materials: list[str]
    activities: list[Activity]

class UpdateLesson (BaseModel):
    subject: str
    topic: str
    grade: int
    duration_minutes: int
    title: str
    objectives: list[str]
    prior_knowledge: list[str]
    materials: list[str]
    activities: list[Activity]