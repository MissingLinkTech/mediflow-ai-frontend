# MediFlow AI Frontend

Next.js 16 frontend using TypeScript, Tailwind CSS, shadcn, TanStack Query, Zustand, React Hook Form, and Zod.
Complex feature styles use colocated SCSS; shared UI uses Tailwind and shadcn primitives.
Light and dark themes follow the system setting and can be changed from the UI.

## Setup

```bash
copy .env.example .env.local
npm install
npm run dev
```

Runs on `http://localhost:5080` by default. Change `PORT` in `.env.local` when needed. Set `API_BASE_URL` to the NestJS `/api/v1` URL.

Authentication uses a Next.js BFF: refresh tokens stay in a secure HttpOnly cookie and access tokens remain in memory.

AI Chat experience runs at `/chat` and `/chat/[id]`, connecting through BFF proxy handlers to the NestJS multi-provider AI engine (Gemini, Groq, OpenAI) with optimistic updates and consultation session management.

Run `npm run check` before handing off changes.
