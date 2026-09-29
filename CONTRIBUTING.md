# Notes from the main author of this project

Hello, thank you for looking at this project. I am making this project as a way to learn and improving my coding knowledge. If there are anything you thought would be beneficial or to improve this project, PLEASE feel free to comment and suggest! ^^

# Contributing to Prep-Period

Thank you for your interest in contributing to Prep-Period! This guide will help you get started.

## Code of Conduct

Be respectful and constructive in all interactions. We're building a welcoming community for teachers, developers, and students.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- Ollama (for local LLM inference)
- Git

### Local Development Setup

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Backend

```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

#### Ollama

Ensure Ollama is running:

```bash
ollama serve
```

In a new terminal, pull a model:

```bash
ollama pull mistral  # or your preferred model
```

## Project Philosophy

Read [AGENTS.md](AGENTS.md) to understand the project's architecture and design principles. Key points:

- **Math-focused**: Prep-Period generates math lessons only
- **Teacher + Student views**: Lessons should have separate teacher and student versions
- **Structured problems**: Math problems are core data, not plain text
- **Maintainable**: Keep the codebase understandable as a learning/portfolio project

## Before You Start

1. Check [open issues](https://github.com/nhat-uyen/prep-period/issues) and [pull requests](https://github.com/nhat-uyen/prep-period/pulls)
2. Open an issue to discuss major features before implementing
3. For bug fixes, feel free to submit a PR directly

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Use descriptive branch names: `feature/`, `fix/`, `docs/`, `style/`, etc.

### 2. Keep Code Consistent

**Frontend (TypeScript + React):**

- Run `npm run lint` to check code style
- Use TypeScript properly—avoid `any` when possible
- Centralize shared types in `src/types/`
- Follow existing component patterns

**Backend (Python + FastAPI):**

- Keep routes thin; move business logic to services
- Use Pydantic models for request/response validation
- Follow existing project structure (routers, models, services)
- Write clear error messages

### 3. Testing

Before submitting a PR:

- Frontend: Run `npm run build` to ensure TypeScript compiles
- Frontend: Run `npm run lint` to check code style
- Backend: Run existing tests if available
- Test your changes manually in the browser and API

### 4. Commits

Make focused, logical commits:

```bash
git commit -m "Add math problem validation"
git commit -m "Update lesson schema"
git commit -m "Fix timezone display in lesson history"
```

Avoid large commits that combine unrelated changes.

## Submitting a Pull Request

1. **Sync with main**: Ensure your branch is up to date

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push your changes**:

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a PR** on GitHub with:
   - Clear title and description
   - Reference to related issues (e.g., "Fixes #42")
   - List of changes made
   - Any testing notes

4. **Respond to feedback** promptly and professionally

## Important Guidelines

- **Preserve existing functionality**: Don't rewrite working code unnecessarily
- **Check API consumers**: If changing a backend endpoint, update frontend code and types
- **Database changes**: Avoid destructive schema changes without discussion
- **UI consistency**: Use existing MUI components; keep styling consistent
- **Error handling**: Don't silently swallow errors; provide clear feedback

## Project Structure

```
prep-period/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── types/            # Shared TypeScript types
│   │   ├── services/         # API calls
│   │   └── App.tsx           # Main app
│   └── package.json
├── backend/                  # Python + FastAPI
│   ├── routers/              # API endpoints
│   ├── models/               # Database models
│   ├── services/             # Business logic
│   └── main.py
├── docs/                     # Documentation
├── AGENTS.md                 # Architecture & guidelines
├── CONTRIBUTING.md           # This file
└── README.md
```

## Getting Help

- Check existing issues and discussions
- Read [AGENTS.md](AGENTS.md) for architecture details
- Ask questions in pull request comments
- Open an issue to discuss ideas

## Recognition

Contributors will be recognized in the repository. Thank you for helping make Prep-Period better!

---

**Happy contributing! 🎓**
