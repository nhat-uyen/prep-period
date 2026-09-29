# Contributing to Prep-Period

## A note from the author

Hello, and thank you for checking out this project! I built Prep-Period to learn and improve my coding skills. If you have ideas or suggestions, please feel free to share them. ^^

Thanks for your interest in contributing. Prep-Period is a learning-focused project for planning math lessons, so contributions should be clear, focused, and consistent with the existing architecture.

## Get started

You’ll need Git, Node.js, Python, and [Ollama](https://ollama.com/) for lesson generation.

Start the frontend in one terminal:

```bash
cd frontend
npm install
npm run dev
```

Start the backend in a second terminal:

```bash
cd backend
python -m venv venv
# Activate the environment: source venv/bin/activate (macOS/Linux)
#                            venv\Scripts\activate (Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Run Ollama separately and ensure a model is available (for example, `ollama pull mistral`). The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:8000`.

## Before making changes

- Fork the project on GitHub, then clone your fork and create a branch for your changes.
- Read [AGENTS.md](AGENTS.md) for the project’s architecture and conventions.
- Check [open issues](https://github.com/nhat-uyen/prep-period/issues) and [pull requests](https://github.com/nhat-uyen/prep-period/pulls).
- Discuss major features in an issue before implementing them; bug fixes can be submitted directly.
- Keep changes focused, preserve existing behavior, and use the established frontend and backend patterns.
- Keep lesson data aligned across backend schemas, persistence, API responses, and frontend types. Math problems should remain structured data.

## Branches, checks, and commits

Create a descriptive branch, such as `feature/problem-search` or `fix/lesson-save`:

```bash
git checkout -b feature/your-change
```

Before opening a pull request, run the relevant checks:

```bash
cd frontend
npm run lint
npm run build
```

Run the available backend tests from the `backend` directory with `pytest`. Manually check affected workflows when practical. Use focused commits with clear messages.

## Open a pull request

Include a clear summary, link related issues (for example, `Fixes #42`), and note the checks you ran. Respond to review feedback constructively.

Be respectful and constructive in issues, pull requests, and discussions. Thanks for helping improve Prep-Period!
