<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project UI rules

- Use Tailwind CSS for styling and shadcn-compatible primitives from `src/components/ui` for shared UI.
- Use SCSS only when Tailwind utilities would make complex styling difficult to maintain. Colocate a dedicated `.scss` file with each feature or layout module; keep global SCSS limited to shared tokens and base rules.
- Every new surface and reusable component must support both light and dark themes through the shared `next-themes` provider and `.dark` design tokens.
- Run `npm run check` after code changes. Prettier owns formatting; ESLint owns correctness and code quality. Do not add formatting rules that conflict with Prettier.
- When a feature or architectural convention changes, update this file and keep `README.md` concise and current.

## Phase 2 Chat Conventions

- Chat features reside under `src/features/chat/` (types, schemas, api, hooks, components, styles).
- BFF route handlers under `src/app/api/chat/` proxy requests to the backend (`/chats`, `/chats/:id`, `/chats/:id/messages`) forwarding auth tokens.
- Chat UI is hosted under `/chat`, `/chat/[id]`, and `/chat?sessionId=[id]`, all rendering a shared two-pane layout.
- Optimistic updates are used for sending messages with pending assistant placeholders and failure retry states.
