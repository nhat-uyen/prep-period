from pydantic import BaseModel, ConfigDict, Field

class LessonRequest(BaseModel):
    subject: str
    topic: str
    grade: str
    duration_minutes: int

class Problem(BaseModel):
    question: str
    instructions: str
    answer: str
    explanation: str
    skills: list[str] = Field(default_factory=list)
    difficulty: str | None = None
    problem_type: str | None = None

class ProblemCreate(Problem):
    pass

class ProblemResponse(Problem):
    model_config = ConfigDict(from_attributes=True)
    id: int
    lesson_id: int | None = None
    activity_id: int | None = None

class Activity(BaseModel):
    name: str
    duration_minutes: int

    # Teacher facing
    teacher_actions: list[str] = Field(default_factory=list)
    teacher_prompts: list[str] = Field(default_factory=list)
    look_fors: list[str] = Field(default_factory=list)
    teacher_notes_prompts: list[str]

    # Student facing
    student_instructions: str
    problems: list[Problem] = Field(default_factory=list)

class ActivityCreate(BaseModel):
    lesson_id: int | None = None
    name: str
    duration_minutes: int
    teacher_actions: list[str] = Field(default_factory=list)
    teacher_prompts: list[str] = Field(default_factory=list)
    look_fors: list[str] = Field(default_factory=list)
    teacher_notes_prompts: list[str]
    student_instructions: str
    problems: list[Problem] = Field(default_factory=list)

class ActivityUpdate(BaseModel):
    lesson_id: int | None = None
    name: str | None = None
    duration_minutes: int | None = None
    teacher_actions: list[str] | None = None
    teacher_prompts: list[str] | None = None
    look_fors: list[str] | None = None
    teacher_notes_prompts: list[str] | None = None
    student_instructions: str | None = None
    problems: list[Problem] | None = None

class ActivityResponse(BaseModel):
    id: int
    lesson_id: int | None
    name: str | None
    duration_minutes: int | None
    teacher_actions: list[str] = Field(default_factory=list)
    teacher_prompts: list[str] = Field(default_factory=list)
    look_fors: list[str] = Field(default_factory=list)
    teacher_notes_prompts: list[str] | None
    student_instructions: str | None
    problems: list[ProblemResponse] = Field(default_factory=list)

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
    grade: str
    duration_minutes: int
    title: str
    objectives: list[str]
    prior_knowledge: list[str]
    materials: list[str]
    activities: list[Activity]

class UpdateLesson (BaseModel):
    subject: str
    topic: str
    grade: str
    duration_minutes: int
    title: str
    objectives: list[str]
    prior_knowledge: list[str]
    materials: list[str]
    activities: list[Activity]