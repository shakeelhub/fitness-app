# AI Fitness Coach App

## Overview

A next-gen AI-powered fitness app for Gen Z men. Full-stack monorepo with a cinematic dark UI, conversational AI personal trainer, voice interaction, MediaPipe pose detection, and real-time workout guidance.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenAI GPT-5.2 via Replit AI Integrations (no API key needed)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── fitness-app/        # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   ├── integrations-openai-ai-server/  # OpenAI server integration
│   └── integrations-openai-ai-react/   # OpenAI React hooks
├── scripts/                # Utility scripts
└── pnpm-workspace.yaml
```

## Features

- **Full-screen intro overlay** - "FORGE YOUR LIMITS" cinematic splash with animated text
- **AI Coach page** - Conversational AI trainer powered by GPT-5.2 with SSE streaming
- **Voice interaction** - Web Speech API for STT, text streamed back as AI response
- **Workout page** - Exercise timer, rep counter, webcam pose detection via MediaPipe
- **Progress page** - Weekly activity chart (recharts), stats, achievement badges
- **Profile page** - Fitness level, goals, and workout preference configuration

## API Routes

- `GET/POST /api/users/profile` - User profile
- `GET/POST /api/workouts/sessions` - Workout session history
- `PATCH /api/workouts/sessions/:id` - Update session
- `POST /api/workouts/generate` - AI-generate a workout plan
- `GET /api/exercises` - Exercise library (auto-seeds on first call)
- `GET /api/progress/stats` - Progress statistics
- `GET/POST /api/openai/conversations` - Chat conversations
- `POST /api/openai/conversations/:id/messages` - SSE streaming AI chat

## Database Schema

- `users` - User profiles (name, age, fitness level, goals)
- `workout_sessions` - Workout history (status, reps, sets, duration)
- `exercises` - Exercise library
- `conversations` - AI chat conversations
- `messages` - Chat message history

## Design

- Ultra-dark black base (#0a0a0f)
- Electric cyan primary (#00ffff)
- Neon purple secondary (#9900ff)
- Hot pink accent (#ff0080)
- Orbitron display font, Chakra Petch body font
- Glassmorphism panels, neon borders, clip-path polygon buttons
- Framer Motion page transitions and micro-animations

## Development Commands

- `pnpm --filter @workspace/api-server run dev` - Start API server
- `pnpm --filter @workspace/fitness-app run dev` - Start frontend
- `pnpm --filter @workspace/api-spec run codegen` - Regenerate API client
- `pnpm --filter @workspace/db run push` - Push DB schema
