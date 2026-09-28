# Prep-Period — Codex Instructions

## 1. Project Overview

Prep-Period is an AI-powered lesson planning application for teachers.

The project is currently being pivoted from a general lesson-plan generator into a **math-focused lesson planning and teaching assistant**.

The application should eventually generate a complete math lesson that includes both:

* Teacher-facing guidance
* Student-facing math work

The goal is to build a useful application while also keeping the codebase understandable and maintainable as a learning/portfolio project.

---

# 2. Current Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Axios
* MUI for UI components

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* SQLite

## AI

* Ollama
* Local LLM inference

The backend communicates with the local Ollama installation to generate structured lesson content.

---

# 3. Existing Architecture

The current application generally follows this flow:

```text
React Frontend
      ↓
Axios
      ↓
FastAPI
      ↓
Lesson API / Services
      ↓
Prompt Builder
      ↓
Ollama
      ↓
Structured Lesson Response
      ↓
SQLite
```

The frontend is responsible for displaying and editing lesson information.

The backend is responsible for:

* API endpoints
* validation
* lesson generation
* database persistence
* communication with Ollama

Keep frontend and backend responsibilities separate.

---

# 4. Important Existing Functionality

The project already has working functionality that should be preserved unless a change is explicitly required.

Existing functionality includes:

* Lesson generation
* FastAPI API endpoints
* Ollama integration
* Structured AI output
* Pydantic validation
* SQLite persistence
* Saving generated lessons
* Retrieving lesson history
* Updating lessons
* Deleting lessons
* React lesson display
* Lesson editing
* Lesson history
* Lesson reflection functionality

Do not rewrite working functionality unnecessarily.

Before changing an existing feature, inspect how it currently works.

---

# 5. Current Product Direction

Prep-Period is now **math-only**.

Do not design new features around generic subjects such as:

* English
* Science
* History
* Social Studies

unless the user explicitly requests a broader subject system.

The main purpose of the application is to generate useful math lessons that contain actual mathematical problems.

The generated lesson should eventually support:

```text
Math Lesson
│
├── Objectives
├── Prior Knowledge
├── Materials
│
├── Activities
│   │
│   ├── Teacher Instructions
│   ├── Student Instructions
│   │
│   └── Math Problems
│       ├── Question
│       ├── Answer
│       └── Explanation
│
└── Assessment Problems
```

---

# 6. Math Problems Are Core Data

Math problems should eventually be treated as structured data rather than plain text embedded inside activity instructions.

A problem should conceptually contain information such as:

```text
Problem
├── question
├── answer
└── explanation
```

Additional fields may be added when they are useful, such as:

* variable
* difficulty
* problem type
* student instructions
* worked solution

Do not add fields simply because they seem useful.

Prefer the smallest data model that supports the current feature.

---

# 7. Mathematical Correctness

An important future direction is independently validating AI-generated math answers.

Do not assume that an LLM-generated answer is mathematically correct.

The eventual architecture should allow something like:

```text
LLM generates problem + answer
             ↓
       Math Validator
             ↓
       ┌─────┴─────┐
       ↓           ↓
    Correct     Incorrect
       ↓           ↓
     Keep       Regenerate
```

When implementing mathematical validation, prefer deterministic mathematical logic or established mathematical libraries where appropriate rather than asking the LLM to verify itself.

Do not implement a full validation system unless the user specifically asks for it.

---

# 8. Teacher Version vs Student Version

The long-term product direction is to generate two views of the same lesson.

## Teacher Version

May contain:

* Teacher actions
* Teacher prompts
* Look-fors
* Teacher notes
* Activity instructions
* Suggested questions

## Student Version

May contain:

* Student instructions
* Math problems
* Workspace
* Answers or answer space where appropriate

These should represent the same underlying lesson rather than being independent lessons.

Prefer shared structured data over duplicating lesson information.

---

# 9. Frontend Guidelines

Use TypeScript properly.

Avoid:

```tsx
any
```

when a meaningful type can be created.

Centralize shared lesson types when practical.

For example:

```text
frontend/
└── src/
    └── types/
        └── lesson.ts
```

Prefer importing shared types rather than redefining the same `Lesson`, `Activity`, or `Problem` types in multiple components.

Keep components focused.

For example:

```text
LessonForm
LessonCard
ActivityList
ActivityEditor
LessonEditor
History
Reflection
```

Do not combine unrelated responsibilities into one large component unless there is a good reason.

---

# 10. React State

Be careful about duplicate sources of truth.

If state is owned by `App`, do not create another independent copy of the same state in a child component without a clear reason.

For example, lesson history should not have two independent reducers managing the same history.

Prefer:

```text
App
 ↓
history state
 ↓
History component
```

over:

```text
App
 ↓
history state A

History
 ↓
history state B
```

When introducing shared state, consider the simplest appropriate solution first.

Do not introduce Context, Redux, Zustand, or another state-management library unless the current architecture actually needs it.

---

# 11. Backend Guidelines

Keep FastAPI routes relatively thin.

Business logic should preferably live in services or appropriate backend modules rather than becoming embedded inside route handlers.

Use Pydantic models for API request and response validation.

Keep database operations separate from API routing when practical.

Existing backend organization may include:

```text
backend/
├── routers/
├── models/
├── services/
└── ...
```

Preserve the existing organization unless there is a clear reason to change it.

---

# 12. API Consistency

Frontend TypeScript types and backend Pydantic models should describe the same data structure.

When changing a backend response:

1. Inspect the corresponding frontend API code.
2. Inspect the TypeScript types.
3. Update all affected consumers.
4. Run the frontend build.
5. Run relevant backend tests.

Do not make an API change without checking its frontend consumers.

---

# 13. Database Changes

Treat SQLite data as persistent application state.

Do not assume that changing a TypeScript interface changes the database.

When changing database models:

* Inspect existing database models.
* Determine whether existing data is affected.
* Avoid destructive changes unless explicitly requested.
* Explain migration implications before making significant schema changes.

For destructive operations such as deleting all lessons, ensure the backend and frontend remain consistent.

---

# 14. UI / Styling

The project uses MUI as the primary UI component library.

Prefer existing MUI components before writing custom CSS.

Examples include:

* Button
* TextField
* Select
* Card
* Dialog
* Rating
* Drawer
* List
* ListItem
* Chip

Avoid creating large CSS files when an existing MUI component or simple component styling can accomplish the same result.

Keep the UI consistent across:

* Lesson generation
* Generated lessons
* Lesson history
* Lesson editing
* Reflection

Do not introduce another major UI framework without discussing it first.

---

# 15. Working With Existing Code

Before modifying code:

1. Inspect the relevant files.
2. Understand the existing implementation.
3. Identify dependencies and consumers.
4. Make the smallest reasonable change.
5. Test the change.

Do not rewrite an entire component simply to make a small modification.

Preserve existing working behavior.

---

# 16. Error Handling

Do not silently swallow errors.

Prefer clear error handling such as:

```python
try:
    ...
except Exception as error:
    logger.error(...)
    ...
```

Frontend errors should provide useful feedback to the user.

Backend errors should return appropriate HTTP responses rather than exposing unnecessary implementation details.

---

# 17. Testing

When modifying functionality:

* Run existing tests when available.
* Run the frontend build after significant TypeScript changes.
* Test affected API endpoints.
* Check browser console errors.
* Check FastAPI logs when debugging backend issues.

Do not claim that something works without testing it when testing is available.

---

# 18. Git Practices

Make focused changes.

Prefer commits such as:

```text
Add math problem model
Update lesson generation schema
Add problem validation
Add student lesson view
Style lesson form
```

over large commits such as:

```text
Fix everything
```

Do not modify unrelated files.

Do not remove working functionality simply to simplify the implementation.

---

# 19. Codex Behavior

When asked to implement something:

### First

Inspect the existing code relevant to the request.

### Then

Briefly explain:

* what you found
* what you intend to change
* which files will be affected

### Then

Make the change.

### Finally

Report:

* files changed
* important implementation details
* tests/builds run
* any remaining issues

Do not make large architectural changes without explaining why they are necessary.

---

# 20. Learning-Friendly Explanations

This project is also being used as a software-development learning project.

When introducing a new concept, briefly explain the reason behind the implementation.

For example, when introducing:

* React state
* reducers
* API services
* Pydantic models
* database relationships
* async code
* TypeScript types
* validation

explain the concept in practical terms before or alongside the implementation.

Do not overwhelm the user with unnecessary theory.

---

# 21. When Requirements Are Ambiguous

If a requested change could reasonably be implemented in multiple substantially different ways, ask before making a major architectural decision.

For small implementation details, choose the simplest approach consistent with the existing architecture.

Do not invent requirements.

---

# 22. Current Priority

The immediate product direction is:

```text
Math-focused lesson generation
        ↓
Structured math problems
        ↓
Teacher + student lesson views
        ↓
Math problem validation
        ↓
Problem library
        ↓
Useful teacher reflection
```

Build incrementally.

Do not attempt to implement the entire roadmap at once.
