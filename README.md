# Fitness-app
# 🏋️‍♂️ AI Fitness Coach

> A next-gen AI-powered fitness web app for the modern athlete. Conversational AI trainer, real-time pose detection, voice interaction, and personalized nutrition — all in a cinematic dark UI.

---

## ✨ Features

- 🤖 **AI Coach** — Conversational fitness trainer powered by Grok LLM with real-time SSE streaming
- 🎙️ **Voice Input** — Hands-free interaction via Web Speech API
- 🏃 **Workout Tracker** — Exercise timer, rep counter, and session history
- 📷 **Pose Detection** — Real-time rep counting using MediaPipe via webcam
- 🥗 **Diet Plan Generator** — AI-generated personalized meal plans with macros and quantities
- 📊 **Progress Dashboard** — Weekly activity charts, stats, and achievement badges
- 👤 **Profile Calibration** — Set fitness level, goals, and preferred workout styles

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express 5 + TypeScript |
| AI | Grok LLM (xAI) + Groq API (Llama 3.3 70B) |
| Database | PostgreSQL + Neon DB + Drizzle ORM |
| Speech | Web Speech API (STT) |
| Vision | MediaPipe Pose Detection |
| Monorepo | pnpm workspaces |
| Validation | Zod + Orval codegen |

---

## 🗂️ Project Structure

fitness-app/
├── artifacts/
│   ├── api-server/         # Express 5 API server
│   └── fitness-app/        # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   ├── db/                 # Drizzle ORM schema + Neon DB
│   └── integrations-openai-ai-server/  # AI server integration
└── scripts/

## 🚀 Getting Started

### Prerequisites
- Node.js 24+
- pnpm
- Neon DB account (free at neon.tech)
- Groq API key (free at console.groq.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/fitness-app.git
cd fitness-app

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
DATABASE_URL=your_neon_connection_string
XAI_API_KEY=your_xai_api_key
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.x.ai/v1
AI_INTEGRATIONS_OPENAI_API_KEY=your_xai_api_key
```

### Database Setup

```bash
pnpm --filter @workspace/db run push
```

### Run the App

```bash
# Terminal 1 — API Server
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend
pnpm --filter @workspace/fitness-app run dev
```

Open **http://localhost:5173** 🚀

---

## 📱 Pages

| Page | Description |
|---|---|
| 🏠 Home | Intro splash with cinematic animation |
| 🤖 Coach | AI chat with voice input and streaming responses |
| 🏋️ Train | Workout session with pose detection and rep counter |
| 📊 Stats | Progress charts, weekly activity, achievement badges |
| 👤 Profile | Fitness calibration + AI diet plan generator |

---

## 🗃️ Database Schema

- `users` — Profile (name, age, fitness level, goals)
- `workout_sessions` — Session history (reps, sets, duration, status)
- `exercises` — Exercise library (auto-seeded)
- `conversations` — AI chat conversations
- `messages` — Chat message history

---

## 🎨 Design System

- **Background** — Ultra-dark black `#0a0a0f`
- **Primary** — Electric cyan `#00ffff`
- **Secondary** — Neon purple `#9900ff`
- **Accent** — Hot pink `#ff0080`
- **Fonts** — Orbitron (display) + Chakra Petch (body)
- Glassmorphism panels, neon borders, Framer Motion animations

---
