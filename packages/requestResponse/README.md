# Shared Types

Shared TypeScript types for `apps/server/` and `apps/frontend/`.

## What
- Moved to `packages/types/` with Turborepo (Step 4, Task 86c1ycjqb).
- Contains `HealthResponse`—shared response type for health endpoints.

## Why
- Enables type consistency between server and frontend (Task 86c1ycjqb criterion).
- `JwtPayload` moved to `apps/server/src/types/auth.ts`—server-specific, not shared.

## Files
- `auth.ts`: `HealthResponse` type.
- `index.ts`: Exports all types.