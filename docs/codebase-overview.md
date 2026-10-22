# Prep-Period Codebase Overview

This document describes the current application, its technology stack, workflows, and repository organization. Agent requirements and coding constraints live in [AGENTS.md](../AGENTS.md); the product workflow is described in [product-workflow.md](./product-workflow.md).

## Project overview

Prep-Period is an AI-assisted lesson planning app for secondary teachers, focused on generating math lessons with teacher-facing guidance and student-facing tasks. It is a learning-focused portfolio project, with an architecture intended to stay understandable and modular.

The app currently includes:

- Lesson generation from subject, topic, grade, and duration
- Teacher and student lesson views
- Saved lesson history
- Lesson reflection
- A reusable skills/problem library
- Structured math problems stored as data rather than only free-form text

## Technology stack

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

- Ollama for local LLM inference
- Structured JSON lesson output

The backend uses Ollama to generate a structured lesson payload and persists it in SQLite. The lesson prompt is organized under `backend/app/llm/prompts/` and composes reusable worksheet-style guidance and LaTeX formatting rules. The streamed lesson-save path repairs common unescaped LaTeX command backslashes before parsing the model response as JSON.

## Repository structure

```text
prep-period/
├── AGENTS.md
├── README.md
├── .github/
│   └── agents/
│       └── prep-period helper.agent.md
├── docs/
│   ├── codebase-overview.md
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
│   │   │   ├── TeacherLessonView.tsx
│   │   │   └── prints/
│   │   │       ├── PrintGlobalStyles.tsx
│   │   │       ├── PrintLessonView.tsx
│   │   │       └── printStyles.ts
│   │   ├── pages/
│   │   │   ├── GenerateLesson.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── PrintLesson.tsx
│   │   │   ├── Reflection.tsx
│   │   │   └── SkillsLibrary.tsx
│   │   ├── reducers/
│   │   │   └── historyReducer.tsx
│   │   └── types/
│   │       └── lesson.ts
│   └── vite.config.ts
└── package.json
```

## Application workflows

### Lesson generation

Teachers generate a structured lesson from:

- Subject
- Topic
- Grade
- Duration

The main backend route is `POST /lessons`, with a streaming version at `POST /lessons/stream` for incremental AI response handling.

### Lesson data

A saved lesson includes:

- `title`
- `objectives`
- `prior_knowledge`
- `materials`
- `activities`

Each activity contains its name, duration, teacher actions and prompts, look-fors, teacher notes prompts, student instructions, and problems. Each problem contains a question, instructions, answer, explanation, skills, and optional difficulty and problem type.

Generated student-facing instructions and problem text may contain LaTeX math delimited with `$...$` or `$$...$$`. The frontend `MathText` component renders this content with `remark-math` and KaTeX in student and teacher lesson views and the skill problem view.

### Teacher and student views

The frontend presents separate teacher and student views of the same generated lesson:

- `TeacherLessonView` presents teacher instructions and guidance.
- `StudentLessonView` presents student instructions and work.

The lesson editor keeps a single lesson object and updates it through the API instead of creating duplicate lesson sources.

### Lesson history and management

The app supports listing saved lessons, selecting an individual lesson, deleting one lesson, clearing the full lesson history, and viewing lesson details with reflection data when present.

### Reflection

The reflection workflow lets teachers rate lesson elements, add notes on objectives, prior knowledge, and materials, rate activity performance, and save reflection records to the backend.

### Skills and problem library

The reusable problem library supports adding problems, browsing by skill tag, searching by skill or problem text, and retaining problem metadata such as skills and instructions.

## Code organization

### Frontend responsibilities

The frontend collects user inputs, renders generated lessons, manages lesson history state, supports lesson editing, presents reflection workflows, browses reusable math problems, and renders inline and display math.

Key files:

- [App.tsx](../frontend/src/App.tsx)
- [GenerateLesson.tsx](../frontend/src/pages/GenerateLesson.tsx)
- [History.tsx](../frontend/src/pages/History.tsx)
- [Reflection.tsx](../frontend/src/pages/Reflection.tsx)
- [SkillsLibrary.tsx](../frontend/src/pages/SkillsLibrary.tsx)
- [lesson.ts](../frontend/src/types/lesson.ts)
- [MathText.tsx](../frontend/src/components/MathText.tsx)

### Backend responsibilities

The backend provides FastAPI routes, lesson generation orchestration, database persistence, Pydantic validation, Ollama prompt construction, and reflection and problem storage.

Key files:

- [main.py](../backend/app/main.py)
- [lessons.py](../backend/app/routers/lessons.py)
- [lesson_service.py](../backend/app/services/lesson_service.py)
- [lesson.py](../backend/app/models/lesson.py)
- [models.py](../backend/app/database/models.py)
- [lesson_prompt.py](../backend/app/llm/prompts/lesson_prompt.py)
- [latex_rules.py](../backend/app/llm/prompts/latex_rules.py)
- [json_repair.py](../backend/app/llm/json_repair.py)
- [ollama_client.py](../backend/app/llm/ollama_client.py)

## Current architecture at a glance

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
