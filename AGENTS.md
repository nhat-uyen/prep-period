# Prep-Period — Agent Guidance

## Project context

Prep-Period is an AI-assisted lesson planning app for secondary teachers, focused on math instruction. Keep the product math-first and teacher-centered; do not design around unrelated subjects such as English, science, history, or social studies unless broader subject support is explicitly requested.

For a descriptive overview of the current application, technology stack, workflows, and repository structure, see [docs/codebase-overview.md](docs/codebase-overview.md). The product workflow is documented in [docs/product-workflow.md](docs/product-workflow.md).

## Product and architecture guidelines

### Keep math problems structural

Problems are core data, not just embedded text. Keep them as typed objects with clear fields such as:

- question
- instructions
- answer
- explanation
- skills
- optional difficulty and problem type

Add new fields only when they clearly support the current feature.

### Share the lesson model

Teacher and student lesson views should come from the same underlying lesson structure. Avoid creating separate lesson models for the same lesson unless there is a strong reason.

### Preserve working features

Before changing behavior, inspect the current implementation in the relevant route, service, component, or model. Do not rewrite working functionality just to simplify the code.

### Keep frontend and backend aligned

When a backend response changes, update the corresponding frontend TypeScript types and consumers. Do not change API behavior in isolation.

Keep LaTeX prompt rules aligned with JSON escaping and backend repair behavior.

### Use existing UI patterns

Prefer the current MUI component structure and styling conventions instead of introducing a new UI stack or a large custom CSS system.

## Coding standards

- Prefer small, focused changes.
- Keep routes thin and move business logic into services.
- Use Pydantic models for backend validation.
- Use TypeScript types instead of `any` when a meaningful type exists.
- Avoid duplicate sources of truth in React state.
- Keep the database and API layers consistent.
- Do not add full validation systems unless the feature specifically requires it.

## Testing and verification

When making code changes:

- Run the relevant tests if available.
- Run the frontend build for TypeScript or UI changes.
- Check API routes affected by the change.
- Verify the lesson generation flow still works.
- Verify reflection, history, and problem-library flows still work.

The app's key workflows are established and should be preserved as features are extended.

## Updating project guidance before pushing

When the user asks to "implement and push" or "commit and push", treat that as authorization to push. Before committing, update this file only if the changes alter durable product, architecture, workflow, development, or convention guidance; include that update in the same commit. Run relevant checks, review the final diff, then push. Never push unless the user explicitly asks.

After a push, refresh this file only when the pushed work introduced durable project guidance that is not yet represented here. Keep the follow-up limited to those changes; do not commit or push the post-push update unless the user explicitly asks.

## Saving implementation ideas for later

When the user says "save this idea for later", "put this idea in implementation", or similar, append a concise, actionable proposal to `IMPLEMENTATION-IDEAS.md`. Do not implement the idea or modify unrelated files. Preserve the document's existing structure, and confirm what was added.
