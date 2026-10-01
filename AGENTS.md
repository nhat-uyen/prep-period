# Prep-Period — Project Guidance

## 1. Project overview

Prep-Period is an AI-assisted lesson planning app for secondary teachers, focused on math instruction. The current product direction is not a general-purpose lesson generator; it is specifically built around generating math lessons with teacher-facing guidance and student-facing tasks.

The app currently includes:

- lesson generation from subject, topic, grade, and duration
- teacher/student lesson views
- saved lesson history
- lesson reflection
- a reusable skills/problem library
- structured math problems stored as data instead of only free-form text

This repository is a learning-focused portfolio project, so changes should stay understandable, modular, and close to the current architecture.

---

## 2. Current technology stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- MUI
- React Router

### Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- SQLite

### AI layer

- Ollama
- local LLM inference
- structured JSON lesson output

The backend uses Ollama to generate a structured lesson payload and then persists it in SQLite.

The current lesson prompt is organized under `backend/app/llm/prompts/`: the lesson prompt composes reusable worksheet-style guidance and LaTeX formatting rules. The streamed lesson-save path repairs common unescaped LaTeX command backslashes before parsing the model response as JSON.

---

## 3. Current repository structure

```text
prep-period/
├── AGENTS.md
├── README.md
├── docs/
│   └── product-workflow.md
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── database/
│   │   │   ├── crud.py
│   │   │   ├── database.py
│   │   │   ├── lesson_crud.py
│   │   │   ├── problem_crud.py
│   │   │   ├── reflection_crud.py
│   │   │   └── models.py
│   │   ├── llm/
│   │   │   ├── json_repair.py
│   │   │   ├── ollama_client.py
│   │   │   ├── schemas.py
│   │   │   └── prompts/
│   │   │       ├── latex_rules.py
│   │   │       ├── lesson_prompt.py
│   │   │       └── worksheet_guidance.py
│   │   ├── models/
│   │   │   ├── lesson.py
│   │   │   └── reflection.py
│   │   ├── routers/
│   │   │   ├── activities.py
│   │   │   ├── lessons.py
│   │   │   ├── problems.py
│   │   │   └── reflections.py
│   │   └── services/
│   │       ├── lesson_service.py
│   │       └── reflection_service.py
│   └── tests/
│       └── test_activities.py
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── theme.ts
│   │   ├── api/
│   │   │   └── lessons.ts
│   │   ├── components/
│   │   │   ├── ActivityEditor.tsx
│   │   │   ├── ActivityReflection.tsx
│   │   │   ├── LessonCardReflection.tsx
│   │   │   ├── LessonEditor.tsx
│   │   │   ├── LessonForm.tsx
│   │   │   ├── LessonHistory.tsx
│   │   │   ├── LessonReflection.tsx
│   │   │   ├── MathText.tsx
│   │   │   ├── SkillProblemsView.tsx
│   │   │   ├── StudentLessonView.tsx
│   │   │   └── TeacherLessonView.tsx
│   │   ├── pages/
│   │   │   ├── GenerateLesson.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Reflection.tsx
│   │   │   └── SkillsLibrary.tsx
│   │   ├── reducers/
│   │   │   └── historyReducer.tsx
│   │   └── types/
│   │       └── lesson.ts
│   └── vite.config.ts
└── package.json
```

---

## 4. What the app does today

### Lesson generation

The app generates a structured lesson using the teacher inputs:

- subject
- topic
- grade
- duration

The main backend route is `POST /lessons`, with a streaming version at `POST /lessons/stream` for incremental AI response handling.

### Lesson data model

The stored lesson shape is already math-oriented and includes:

- `title`
- `objectives`
- `prior_knowledge`
- `materials`
- `activities`

Each activity contains:

- name
- duration
- teacher actions
- teacher prompts
- look-fors
- teacher notes prompts
- student instructions
- problems

Each problem contains:

- question
- instructions
- answer
- explanation
- skills
- optional difficulty and problem type

Generated student-facing instructions and problem text may contain LaTeX math delimited with `$...$` or `$$...$$`. The frontend `MathText` component renders this content with `remark-math` and KaTeX in student and teacher lesson views and the skill problem view. Keep LaTeX prompt rules aligned with JSON escaping and backend repair behavior.

This is already closer to a real math lesson model than the original generic lessons and should remain the foundation for future work.

### Teacher and student views

The frontend supports separate views for the same generated lesson:

- `TeacherLessonView` for teacher instructions and guidance
- `StudentLessonView` for student instructions and work

The lesson editor keeps a single lesson object and updates it through the API instead of creating duplicate lesson sources.

### Lesson history and management

The app saves lessons and exposes history to the user:

- list saved lessons
- select an individual lesson
- delete one lesson
- clear the full lesson history
- view lesson details with reflection data when present

### Reflection workflow

The app has a first-class reflection system:

- rate lesson elements
- add notes on objectives, prior knowledge, and materials
- rate activity performance
- save reflection records back to the backend

### Skills/problem library

There is a reusable problem library with:

- add problem form
- browse by skill tag
- search by skill or problem text
- keep problem metadata such as skills and instructions

This is a meaningful step toward future reuse of high-quality math problems.

---

## 5. How the code is organized

### Frontend responsibilities

The frontend is responsible for:

- collecting user inputs
- rendering generated lessons
- managing lesson history state
- allowing lesson editing
- presenting reflection workflows
- browsing reusable math problems
- rendering inline and display math in lesson and problem text

Important files:

- [frontend/src/App.tsx](frontend/src/App.tsx)
- [frontend/src/pages/GenerateLesson.tsx](frontend/src/pages/GenerateLesson.tsx)
- [frontend/src/pages/History.tsx](frontend/src/pages/History.tsx)
- [frontend/src/pages/Reflection.tsx](frontend/src/pages/Reflection.tsx)
- [frontend/src/pages/SkillsLibrary.tsx](frontend/src/pages/SkillsLibrary.tsx)
- [frontend/src/types/lesson.ts](frontend/src/types/lesson.ts)
- [frontend/src/components/MathText.tsx](frontend/src/components/MathText.tsx)

### Backend responsibilities

The backend is responsible for:

- FastAPI routes
- lesson generation orchestration
- database persistence
- validation with Pydantic
- instruction prompt construction for Ollama
- reflection and problem storage

Important files:

- [backend/app/main.py](backend/app/main.py)
- [backend/app/routers/lessons.py](backend/app/routers/lessons.py)
- [backend/app/services/lesson_service.py](backend/app/services/lesson_service.py)
- [backend/app/models/lesson.py](backend/app/models/lesson.py)
- [backend/app/database/models.py](backend/app/database/models.py)
- [backend/app/llm/prompts/lesson_prompt.py](backend/app/llm/prompts/lesson_prompt.py)
- [backend/app/llm/prompts/latex_rules.py](backend/app/llm/prompts/latex_rules.py)
- [backend/app/llm/json_repair.py](backend/app/llm/json_repair.py)
- [backend/app/llm/ollama_client.py](backend/app/llm/ollama_client.py)

---

## 6. Current product direction

Prep-Period should remain math-first.

Do not design new features around unrelated subjects such as:

- English
- Science
- History
- Social Studies

unless a user explicitly requests broader subject support.

The product should keep moving toward:

1. stronger structured math problem generation
2. teacher/student lesson parity from one shared lesson model
3. more reliable problem validation
4. reusable problem bank workflows
5. better teacher reflection and lesson improvement

---

## 7. Data and architecture guidelines

### Keep math problems structural

Problems are core data, not just embedded text. Keep them as typed objects with clear fields such as:

- question
- instructions
- answer
- explanation
- skills
- optional difficulty and problem type

Add new fields only when they clearly support the current feature.

### Shared lesson model over duplicated data

Teacher and student lesson views should come from the same underlying lesson structure. Avoid creating separate lesson models for the same lesson unless a strong reason exists.

### Preserve working features

Before changing behavior, inspect the current implementation in the relevant route, service, component, or model. Do not rewrite working functionality just to simplify the code.

### Keep frontend and backend aligned

When a backend response changes, update the corresponding frontend TypeScript types and consumers. API changes should not be made in isolation.

### Use the existing MUI patterns

Prefer the current MUI component structure and styling conventions instead of introducing a new UI stack or a large custom CSS system.

---

## 8. Coding standards for this repo

- Prefer small, focused changes.
- Keep routes thin and move business logic into services.
- Use Pydantic models for backend validation.
- Use TypeScript types instead of `any` when a meaningful type exists.
- Avoid duplicate sources of truth in React state.
- Keep the app math-focused and teacher-centered.
- Keep the database and API layers consistent.
- Do not add full validation systems unless the feature specifically requires it.

---

## 9. Testing and verification

When making code changes:

- run the relevant tests if available
- run the frontend build for TypeScript/UI changes
- check API routes affected by the change
- verify the lesson generation flow still works
- verify reflection, history, and problem-library flows still work

This project is not just a prototype; the key workflows are already in place and should be preserved as features are extended.

---

## 10. Current implementation summary

The current structure already reflects the project’s real direction:

```text
React frontend
  -> lesson generation
  -> teacher/student lesson views
  -> reflection and lesson history
  -> skills library
  -> saved math problems

FastAPI backend
  -> AI lesson generation via Ollama
  -> structured lesson schema validation
  -> SQLite persistence
  -> problem and reflection storage
```

Frontend math rendering uses React Markdown, `remark-math`, and KaTeX. Backend prompt modules separate lesson structure, worksheet guidance, and LaTeX output rules; `json_repair.py` handles common LaTeX escape issues on the streamed save path.

This file should be treated as the current project context for future work. Keep future changes aligned with this actual architecture and feature set.
