# Prep-Period

Prep-Period is an AI-assisted lesson planning app for secondary math teachers. It generates structured math lessons with guidance for teachers and tasks for students, using a locally running Ollama model.

## What you can do

- Generate a lesson from a topic, grade, and duration.
- Review and edit a lesson, then save it to local lesson history.
- Use teacher and student lesson views built from the same lesson.
- Print a lesson in a print-friendly layout.
- Reflect on lessons and record notes and activity feedback.
- Browse and search a reusable math problem library by skill.
- Work with structured problems that include questions, answers, explanations, skills, and optional metadata.

Lesson data is stored locally in SQLite. AI lesson generation requires Ollama to be running on your machine. (For now!)

## Run locally

### Prerequisites

- Node.js and npm
- Python
- [Ollama](https://ollama.com/)

### 1. Start the backend

In a terminal:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

```bash
# macOS / Linux
source .venv/bin/activate
```

Install the backend dependencies and download the default model:

```bash
python -m pip install -r requirements.txt
ollama pull qwen2-math
```

Make sure Ollama is running, then start the API from the `backend` directory:

```bash
python -m uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. Its interactive API documentation is at `http://localhost:8000/docs`. On startup, the backend creates or updates the SQLite database at `backend/prep_period.db`.

The default Ollama settings are `OLLAMA_MODEL=qwen2-math` and `OLLAMA_HOST=http://localhost:11434`. Override these with environment variables or values in `backend/.env` if needed.

### 2. Start the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173` in your browser. The frontend expects the backend at `http://localhost:8000`.

## For contributors

Start with [CONTRIBUTING.md](CONTRIBUTING.md) for contribution workflow and checks. [AGENTS.md](AGENTS.md) contains project-specific development guidance.

Useful references:

- [Codebase overview](docs/codebase-overview.md) - architecture, technology stack, and repository structure
- [Product workflow](docs/product-workflow.md) - lesson, problem library, and reflection workflow

The frontend's available checks are:

```bash
cd frontend
npm run lint
npm run build
```

Run backend tests from the `backend` directory with `pytest`.
