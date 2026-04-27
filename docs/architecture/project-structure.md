# Project Structure

The app is an Electron desktop MVP for an AI资料生产工作台.

## Process Split

- `electron/main.ts` creates the desktop window and registers IPC handlers.
- `electron/preload.ts` exposes a small `desktopBridge` API with context isolation enabled.
- `src/` contains the React renderer, route shell, stores, workbench UI, and service abstractions.

## Project JSON

Project data is modeled in `src/domain/projects/types.ts` and validated by `src/domain/projects/schemas.ts`.

The current MVP serializes project snapshots with `serializeProject(project)`, producing readable JSON for export and debugging.

## MVP Boundaries

The current implementation intentionally uses rule-based services for understanding, structure, and draft generation. These services are isolated so later AI-backed implementations can replace them without changing the UI contract.
