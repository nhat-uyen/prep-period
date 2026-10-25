from typing import Literal, Annotated, Union

from pydantic import BaseModel, ConfigDict, Field, model_validator

#---------- Reponse Area Models -------------

# Notes about these models:
# The discriminator (type) picks the right model, so a bad grid fails with an error about the grid’s fields instead of a confusing union error.
# The limits are guard rails, not product decisions. They keep bad or runaway data (a 500-row table, a grid with step: 0) from reaching the print view. Loosen them if you disagree with a number.
# Old data keeps working because the field is optional with a None default.

class NoneArea(BaseModel):
    type: Literal["none"]

class BlankArea(BaseModel):
    type: Literal["blank"]
    height: Literal["small", "medium", "large"]="medium"

class LinesArea(BaseModel):
    type: Literal["lines"]
    count: int = Field(ge=1, le=30)

class GridArea(BaseModel):
    type: Literal["grid"]
    x_min: float
    x_max: float
    y_min: float
    y_max: float
    step: float = Field(gt=0)
    show_axes: bool = True

    @model_validator(mode="after")
    def check_bounds(self):
        if self.x_max <= self.x_min or self.y_max <= self.y_min:
            raise ValueError("grid max must be greater than min")
        return self

class NumberLineArea(BaseModel):
    type: Literal["number_line"]
    min: float
    max: float
    step: float = Field(gt=0)

    @model_validator(mode="after")
    def check_bounds(self):
        if self.max <= self.min:
            raise ValueError("number line max must be greater than min")
        return self

class TableArea(BaseModel):
    type: Literal["table"]
    columns: list[str] = Field(min_length=1, max_length=8)
    rows: int = Field(ge=1, le=30)
    prefilled: list[list[str]] | None = None

class MultipleChoiceArea(BaseModel):
    type: Literal["multiple_choice"]
    choices: list[str] = Field(min_length=2, max_length=8)
    layout: Literal["list", "two_column"] = "list"

ResponseArea = Annotated[
    Union[NoneArea, BlankArea, LinesArea, GridArea, NumberLineArea, TableArea, MultipleChoiceArea],
    Field(discriminator="type")
]

# -------- Problem Models --------
class Problem(BaseModel):
    question: str
    instructions: str
    answer: str
    explanation: str
    skills: list[str] = Field(default_factory=list)
    difficulty: str | None = None
    problem_type: str | None = None
    response_area: ResponseArea | None = None

class ProblemCreate(Problem):
    pass

class ProblemUpdate(Problem):
    pass

class ProblemResponse(Problem):
    model_config = ConfigDict(from_attributes=True)
    id: int
    lesson_id: int | None = None
    activity_id: int | None = None

class ProblemPage(BaseModel):
    items: list[ProblemResponse]
    limit: int
    offset: int
    has_more: bool

class SkillProblemMatch(BaseModel):
    skill_name: str
    problem:ProblemResponse

class SkillProblemMatchPage(BaseModel):
    items: list[SkillProblemMatch]
    limit: int
    offset: int
    has_more: bool

# -------- Activity Models --------
class Activity(BaseModel):
    name: str
    duration_minutes: int

    # Teacher facing
    teacher_actions: list[str] = Field(default_factory=list)
    teacher_prompts: list[str] = Field(default_factory=list)
    look_fors: list[str] = Field(default_factory=list)
    teacher_notes_prompts: list[str] = Field(default_factory=list)

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
    teacher_notes_prompts: list[str] = Field(default_factory=list)
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
    teacher_notes_prompts: list[str] = Field(default_factory=list)
    student_instructions: str | None
    problems: list[ProblemResponse] = Field(default_factory=list)

# -------- Lesson Models --------
class LessonRequest(BaseModel):
    topic: str
    grade: str
    duration_minutes: int
    learning_outcomes: list[str] = Field(default_factory=list)
    problem_ids: list[int] = Field(default_factory=list)

# for all lesson repsonse before saving
class LessonResponse(BaseModel):
    title: str
    objectives: list[str]
    prior_knowledge: list[str]
    materials: list[str]
    activities: list[Activity]

# for sending lesson data for saving
class LessonSaveRequest(BaseModel):
    topic: str
    grade: str
    duration_minutes: int
    lesson: LessonResponse

class LessonUpdate (BaseModel):
    topic: str
    grade: str
    duration_minutes: int
    title: str
    objectives: list[str]
    prior_knowledge: list[str]
    materials: list[str]
    activities: list[Activity]