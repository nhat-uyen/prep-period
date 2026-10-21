# Future Implementation Ideas

Proposals for future Prep-Period work; these are not implemented yet.

## 1. Model selection for lesson generation

Add a model picker to the lesson form so teachers can choose among models installed in Ollama without changing configuration or restarting the backend.

### Backend

- Keep `OLLAMA_MODEL` in `backend/app/config.py` as the default; add `GET /models` to list installed Ollama models and return that default.
- Add an optional model to `LessonRequest` in `backend/app/models/lesson.py`. Pass it through both routes in `backend/app/routers/lessons.py` to the generation functions in `backend/app/llm/ollama_client.py`.
- Use the configured default when no model is provided; return clear errors for unavailable models or Ollama failures.
- Include the selected model in generated lesson metadata and preserve it through saving and loading.
- Use consistent generation options in streaming and non-streaming paths.

### Frontend

- Add typed model-list and generation request functions in `frontend/src/api/lessons.ts`.
- In `frontend/src/components/LessonForm.tsx`, fetch available models, default to the backend-provided choice, and let the user select a model for generation.
- Add the model to the `LessonRequest` and lesson/draft types in `frontend/src/types/lesson.ts`; show which model generated a lesson.

Test model listing, selection, default behavior, errors, both generation paths, and saved metadata.

Keep this Ollama-only for now; provider integrations and model-management features are out of scope.

## 2. Guided chat-based lesson reflections

Replace the form-based reflection workflow with a guided chat that lets teachers freely describe what happened during a lesson. Prompt teachers about objectives, prior knowledge, materials, individual activities, and overall takeaways, while keeping responses open-ended and allowing multiple messages.

### Backend

- Extend the reflection data model and API to store an ordered chat transcript per lesson, including message role, text, and the relevant reflection section.
- Save messages automatically as the teacher responds, and support completing or resuming an in-progress reflection.
- On completion, create and persist a concise reflection summary covering what worked, student needs, and what to keep or change.
- Make the saved summary available to future lesson generation for personalization; keep the full transcript available as reflection history.

### Frontend

- Replace the form-based reflection workflow with a guided chat in which teachers can respond freely and add multiple messages.
- Provide prompts for objectives, prior knowledge, materials, individual activities, and overall takeaways without limiting responses to a fixed form.
- Automatically save the conversation for the selected lesson and let the teacher finish the reflection.
- Display the resulting summary document, with clear save/completion feedback and the ability to revisit the reflection.
