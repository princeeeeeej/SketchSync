<div align="center">

# 🎨 SketchSync

### Real-time collaborative whiteboard built for software engineering teams

SketchSync combines a high-performance canvas engine, multiplayer collaboration, and AI-powered diagram-to-code generation into a single developer-first workspace.

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![WebSockets](https://img.shields.io/badge/WebSockets-121212?style=for-the-badge&logo=socketdotio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![TurboRepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)

</div>

---

# About

Most collaborative whiteboards are optimized for generic brainstorming.

SketchSync was built specifically for developers.

The goal was to create a system where engineering teams can:
- brainstorm architecture visually,
- collaborate in real time,
- and convert rough diagrams directly into technical documentation.

Instead of relying on SVG-heavy rendering or expensive DOM trees, SketchSync uses a custom TypeScript canvas engine designed for performance under continuous interaction and multiplayer synchronization.

The result is a fast, scalable, engineering-focused whiteboard that feels closer to a game engine than a traditional SaaS dashboard.

---

# Features

## ⚡ AI Diagram-to-Code

Turn hand-drawn architecture diagrams into production-ready Mermaid.js diagrams using Google Gemini 1.5 Flash Vision.

- Accepts base64 canvas snapshots
- In-memory image contrast normalization for dark-mode drawings
- AI-generated Mermaid.js output
- Export directly into GitHub READMEs, Notion docs, or technical RFCs

---

## 🖌️ Custom Canvas Rendering Engine

Built from scratch using vanilla HTML5 `<canvas>` and TypeScript.

### Includes:
- Infinite panning
- Smooth zooming
- Precision pointer hit-detection
- Bounding-box resizing
- Low-overhead rendering pipeline
- Dynamic modulo-math grid rendering

Unlike SVG-based editors, SketchSync avoids thousands of DOM nodes and keeps rendering performance predictable even during multiplayer sessions.

---

## 🌐 Real-Time Multiplayer Collaboration

Powered by native WebSockets (`ws`) with dedicated synchronization infrastructure.

### Multiplayer capabilities:
- Live cursor tracking
- Real-time shape previews
- Active user presence
- Shared room synchronization
- ~60 FPS throttled payload broadcasting (~16ms intervals)

The networking layer was optimized to minimize unnecessary packet spam while still feeling instant to users.

---

## 🎨 SaaS-Grade User Experience

Developer tools should feel polished.

SketchSync includes:
- Dark mode-first UI (`#09090b`)
- Glassmorphic floating toolbars
- Smooth interactions and transitions
- Precision resize handles
- Responsive interaction feedback
- Clean developer-centric visual design

---

# 🧠 Killer Feature Spotlight — AI Diagram → Mermaid.js

This is the core feature that differentiates SketchSync from traditional whiteboard tools.

## Workflow

1. User sketches a rough flowchart on the canvas
2. Canvas snapshot is captured as a base64 image
3. Image is normalized in-memory to improve AI readability
4. Snapshot is sent to the Express AI service
5. Google Gemini 1.5 Flash Vision analyzes the structure
6. The backend generates valid Mermaid.js syntax
7. Developers paste the result directly into:
   - GitHub
   - Notion
   - Markdown docs
   - Architecture RFCs

### Example Flow

```mermaid
flowchart LR
    A[Hand Drawn Diagram] --> B[Canvas Snapshot]
    B --> C[Image Normalization]
    C --> D[Gemini Vision API]
    D --> E[Mermaid.js Output]
    E --> F[GitHub / Notion / Docs]
```

This bridges the gap between fast visual thinking and maintainable technical documentation.

---

# 🏗️ Architecture Diagram

```mermaid
graph TD

    A[Next.js 15 Client] -->|REST Requests| B[Express HTTP API]
    A -->|WebSocket Events| C[WS Collaboration Server]

    B -->|Gemini Vision Requests| D[Google Gemini 1.5 Flash]
    B -->|Database Access| E[(PostgreSQL)]

    C -->|Room State Sync| E

    E --> F[Drizzle ORM]

    subgraph Monorepo
        G[apps/web]
        H[apps/http-backend]
        I[apps/ws-backend]
        J[packages/db]
        K[packages/common]
    end
```

---

# 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Canvas Engine | HTML5 Canvas API |
| Realtime Layer | Native WebSockets (`ws`) |
| Backend APIs | Express.js |
| AI Integration | Google Gemini 1.5 Flash Vision |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Monorepo | Turborepo + pnpm Workspaces |

---

# 🚧 Technical Challenges Overcome

## Rendering Performance at Scale

Rendering thousands of interactive objects inside React can become expensive quickly.

SketchSync avoids this by:
- using a single `<canvas>` render surface,
- implementing manual draw cycles,
- and separating interaction state from React reconciliation.

This keeps interactions smooth even during continuous drag operations and zooming.

---

## Dynamic Infinite Grid System

A static grid breaks visually at different zoom levels.

SketchSync uses modulo-based mathematical scaling to dynamically:
- halve grid spacing while zooming in,
- double spacing while zooming out,
- and maintain consistent visual density.

The result feels infinitely scalable without clutter.

---

## WebSocket Traffic Optimization

Naive real-time broadcasting creates network bottlenecks fast.

The multiplayer layer solves this using:
- frame-throttled synchronization (~16ms),
- lightweight payload diffs,
- live preview states,
- and selective event broadcasting.

This keeps collaboration responsive without saturating the connection.

---

## AI Readability in Dark Mode

AI vision models struggled with low-contrast dark-mode sketches.

To improve recognition accuracy:
- snapshots are normalized in-memory before inference,
- contrast is boosted dynamically,
- and preprocessing occurs before sending requests to Gemini.

This dramatically improved Mermaid generation quality.

---

# 📂 Monorepo Structure

```bash
apps/
 ├── web             # Next.js frontend
 ├── http-backend    # Express AI/API server
 └── ws-backend      # WebSocket collaboration server

packages/
 ├── db              # Drizzle ORM + schema
 ├── common          # Shared types/utilities
 └── ui              # Shared UI components
```

---

# ⚡ Quick Start

## 1. Clone the repository

```bash
git clone https://github.com/your-username/sketchsync.git

cd sketchsync
```

---

## 2. Install dependencies

```bash
pnpm install
```

---

## 3. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/sketchsync

GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

---

## 4. Start the development environment

```bash
pnpm dev
```

This starts:
- Next.js frontend
- Express HTTP API
- WebSocket collaboration server

---

# 🧪 Future Improvements

- CRDT-based synchronization
- Multiplayer replay timelines
- Canvas layer system
- AI-generated sequence diagrams
- Voice-to-diagram workflows
- Offline-first room persistence

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you're interested in:
- canvas rendering systems,
- multiplayer infrastructure,
- AI-assisted developer tooling,
- or real-time collaboration systems,

feel free to open a PR or start a discussion.

---

# 📜 License

MIT License © 2026 SketchSync

---

<div align="center">

Built for engineers who think visually.

</div>
