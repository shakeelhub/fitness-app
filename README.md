<div align="center">

```
 █████╗ ██╗    ███████╗██╗████████╗███╗   ██╗███████╗███████╗███████╗
██╔══██╗██║    ██╔════╝██║╚══██╔══╝████╗  ██║██╔════╝██╔════╝██╔════╝
███████║██║    █████╗  ██║   ██║   ██╔██╗ ██║█████╗  ███████╗███████╗
██╔══██║██║    ██╔══╝  ██║   ██║   ██║╚██╗██║██╔══╝  ╚════██║╚════██║
██║  ██║██║    ██║     ██║   ██║   ██║ ╚████║███████╗███████║███████║
╚═╝  ╚═╝╚═╝    ╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝╚══════╝╚══════╝
```

<h3>🏋️‍♂️ Your AI-Powered Personal Trainer. In the Browser. Right Now.</h3>

<p>
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=00FFFF"/>
  <img src="https://img.shields.io/badge/Node.js-0a0a0f?style=for-the-badge&logo=nodedotjs&logoColor=68D391"/>
  <img src="https://img.shields.io/badge/TypeScript-0a0a0f?style=for-the-badge&logo=typescript&logoColor=3B82F6"/>
  <img src="https://img.shields.io/badge/PostgreSQL-0a0a0f?style=for-the-badge&logo=postgresql&logoColor=60A5FA"/>
  <img src="https://img.shields.io/badge/MediaPipe-0a0a0f?style=for-the-badge&logo=google&logoColor=FF0080"/>
  <img src="https://img.shields.io/badge/Groq_LLM-0a0a0f?style=for-the-badge&logo=openai&logoColor=9900FF"/>
</p>

<p>
  <img src="https://img.shields.io/badge/pnpm-monorepo-F69220?style=for-the-badge&logo=pnpm&logoColor=white"/>
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black"/>
  <img src="https://img.shields.io/badge/Framer_Motion-FF0055?style=for-the-badge&logo=framer&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-00FFFF?style=for-the-badge"/>
</p>

</div>

---

<div align="center">

## 〔 THE VISION 〕

> *"Not a fitness tracker. Not a chatbot. A full-stack AI athlete in your browser — that sees your body, hears your voice, plans your meals, and pushes you harder than any human coach would."*

</div>

---

## ⚡ Feature Arsenal

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🤖  AI COACH          Conversational trainer via Grok LLM     ║
║                         Real-time SSE streaming responses        ║
║                                                                  ║
║   🎙️  VOICE INPUT        Hands-free via Web Speech API           ║
║                         Talk to your coach mid-workout           ║
║                                                                  ║
║   📷  POSE DETECTION     MediaPipe live rep counting             ║
║                         Your webcam becomes a spotter            ║
║                                                                  ║
║   🥗  DIET GENERATOR     AI meal plans with macros               ║
║                         Calibrated to YOUR goals                 ║
║                                                                  ║
║   📊  PROGRESS DASH      Weekly charts + achievement badges      ║
║                         Track every drop of sweat                ║
║                                                                  ║
║   👤  PROFILE CALIB      Set level, goals, workout style         ║
║                         The AI adapts. Always.                   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td><b>Layer</b></td>
<td><b>Technology</b></td>
<td><b>Why</b></td>
</tr>
<tr>
<td>🎨 Frontend</td>
<td>React 19 + Vite + Tailwind + Framer Motion</td>
<td>Cinematic UI, silky animations</td>
</tr>
<tr>
<td>⚙️ Backend</td>
<td>Node.js + Express 5 + TypeScript</td>
<td>Type-safe, blazing fast API</td>
</tr>
<tr>
<td>🧠 AI</td>
<td>Grok LLM (xAI) + Groq Llama 3.3 70B</td>
<td>Smartest coach in the room</td>
</tr>
<tr>
<td>🗄️ Database</td>
<td>PostgreSQL + Neon DB + Drizzle ORM</td>
<td>Serverless, instant, reliable</td>
</tr>
<tr>
<td>👁️ Vision</td>
<td>MediaPipe Pose Detection</td>
<td>Real-time body tracking</td>
</tr>
<tr>
<td>🎙️ Speech</td>
<td>Web Speech API</td>
<td>Zero dependency voice input</td>
</tr>
<tr>
<td>📦 Monorepo</td>
<td>pnpm workspaces</td>
<td>Clean, scalable structure</td>
</tr>
<tr>
<td>✅ Validation</td>
<td>Zod + Orval codegen</td>
<td>End-to-end type safety</td>
</tr>
</table>

---

## 🗂️ Project Structure

```
fitness-app/
│
├── 📦 artifacts/
│   ├── api-server/              ⚙️  Express 5 API — the engine
│   └── fitness-app/             🎨  React + Vite — the face
│
├── 📚 lib/
│   ├── api-spec/                📋  OpenAPI spec + Orval codegen
│   ├── api-client-react/        🔗  Generated React Query hooks
│   ├── api-zod/                 🛡️  Generated Zod schemas
│   ├── db/                      🗄️  Drizzle ORM schema + Neon DB
│   └── integrations-openai-ai-server/   🤖  AI server integration
│
└── 🔧 scripts/                  🛠️  Dev utilities
```

---

## 🚀 Getting Started

### Prerequisites
```
✅ Node.js 24+
✅ pnpm
✅ Neon DB account  →  neon.tech (free)
✅ Groq API key     →  console.groq.com (free)
```

### 1️⃣ Clone & Install
```bash
git clone https://github.com/yourusername/fitness-app.git
cd fitness-app
pnpm install
```

### 2️⃣ Environment Setup
```env
# .env in project root

DATABASE_URL=your_neon_connection_string
XAI_API_KEY=your_xai_api_key
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.x.ai/v1
AI_INTEGRATIONS_OPENAI_API_KEY=your_xai_api_key
```

### 3️⃣ Database Setup
```bash
pnpm --filter @workspace/db run push
```

### 4️⃣ Fire It Up 🔥
```bash
# Terminal 1 — API Server
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend
pnpm --filter @workspace/fitness-app run dev
```

```
Open → http://localhost:5173 🚀
```

---

## 📱 Pages

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🏠  HOME      Cinematic splash — welcome to the grind  │
│                                                         │
│  🤖  COACH     AI chat + voice + streaming responses    │
│                                                         │
│  🏋️  TRAIN     Live pose detection + rep counter        │
│                                                         │
│  📊  STATS     Charts, weekly activity, badges          │
│                                                         │
│  👤  PROFILE   Fitness calibration + diet generator     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗃️ Database Schema

```
users               → Profile, fitness level, goals
workout_sessions    → History, reps, sets, duration
exercises           → Library (auto-seeded on startup)
conversations       → AI chat sessions
messages            → Full message history
```

---

## 🎨 Design System

```css
/* The Palette */
--bg-primary:    #0a0a0f;   /* Ultra-dark black    */
--color-cyan:    #00ffff;   /* Electric cyan       */
--color-purple:  #9900ff;   /* Neon purple         */
--color-pink:    #ff0080;   /* Hot pink accent     */

/* The Fonts */
--font-display:  'Orbitron';       /* Futuristic headers  */
--font-body:     'Chakra Petch';   /* Sharp body text     */

/* The Vibe */
Glassmorphism panels  +  Neon borders  +  Framer Motion  =  🔥
```

---

## 🗺️ Roadmap

- [x] 🤖 Conversational AI coach with streaming
- [x] 🎙️ Voice input hands-free mode
- [x] 📷 Real-time pose detection + rep counter
- [x] 🥗 AI diet plan generator
- [x] 📊 Progress dashboard + badges
- [ ] 📱 PWA / mobile app
- [ ] 🏆 Multiplayer challenges
- [ ] 🔔 Smart push notifications
- [ ] 🧬 Biometric integration (Apple Health / Google Fit)
- [ ] 🌍 Multi-language support

---

## 🤝 Contributing

```bash
# 1. Fork it
# 2. Create your feature branch
git checkout -b feature/something-insane

# 3. Commit
git commit -m "feat: add something that slaps"

# 4. Push
git push origin feature/something-insane

# 5. Open a PR 🚀
```

---

## 📄 License

**MIT** — free to use, fork, and build on.  
Built with 🔥 + caffeine + too many PRs.

---

<div align="center">

```
"The only bad workout is the one that didn't happen."
```

**⭐ Star this repo if it helped you. It genuinely means a lot.**

</div>
