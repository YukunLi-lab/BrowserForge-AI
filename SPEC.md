# BrowserForge AI - Technical Specification

## 1. Project Overview

**Project Name:** BrowserForge AI
**Type:** Full-stack web application (monorepo)
**Core Functionality:** Natural language → deployable web app generation via multi-agent pipeline
**Target Users:** Developers, startup founders, non-technical users wanting rapid prototyping

## 2. Architecture

### 2.1 Tech Stack
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Monaco Editor
- **Backend:** FastAPI (Python) + Playwright + Docker SDK
- **Database:** SQLite (development) / PostgreSQL (production)
- **Queue:** Redis + BullMQ
- **Sandbox:** Docker containers (alibaba/OpenSandbox-style isolation)
- **Deployment:** Vercel (frontend) + Docker (backend)

### 2.2 Monorepo Structure
```
browserforge-ai/
├── app/                    # Next.js 15 frontend
├── api/                    # FastAPI backend
├── packages/
│   └── shared/             # Shared types and utilities
├── docker/                 # Docker configurations
├── .github/
│   └── workflows/          # CI/CD pipelines
├── docker-compose.yml
└── turbo.json
```

## 3. Features & User Flow

### 3.1 Core Flow
1. **User Input:** Describe app in natural language
2. **Researcher Agent:** Scrapes docs/APIs using Playwright
3. **Coder Agent:** Generates complete Next.js/Tauri app
4. **Tester Agent:** Runs Playwright tests in sandbox
5. **Deployer Agent:** Creates Vercel/Netlify configs and deploys

### 3.2 Frontend Features
- Landing page with hero and demo GIF placeholder
- Dashboard with project history
- Live editor with Monaco + embedded iframe preview
- Public gallery for community templates
- Real-time agent progress streaming (SSE)
- Authentication (simple JWT-based)

### 3.3 Backend Features
- Multi-agent orchestration pipeline
- Playwright browser automation for research
- Docker sandbox management with resource limits
- Redis-backed job queue for agent tasks
- SQLite/PostgreSQL persistence for projects
- File generation and storage

## 4. API Design

### 4.1 Endpoints
```
POST   /api/projects              - Create new project
GET    /api/projects              - List user projects
GET    /api/projects/:id          - Get project details
DELETE /api/projects/:id          - Delete project
POST   /api/projects/:id/forge    - Start forging (run agents)
GET    /api/projects/:id/status   - Get forge status (SSE)
GET    /api/projects/:id/preview   - Get preview URL
POST   /api/projects/:id/deploy    - Deploy project
GET    /api/gallery               - List public templates
POST   /api/auth/register         - Register user
POST   /api/auth/login             - Login
```

## 5. Agent System

### 5.1 Researcher Agent
- Uses Playwright to browse and scrape documentation
- Extracts relevant API patterns, UI components, best practices
- Returns structured research data to Coder Agent

### 5.2 Coder Agent
- Receives user prompt + research data
- Generates full Next.js application with:
  - App Router structure
  - Tailwind styling
  - shadcn/ui components
  - API routes
  - TypeScript types
- Uses LLM with code generation capabilities

### 5.3 Tester Agent
- Runs generated app in Docker sandbox
- Executes Playwright tests
- Reports pass/fail with screenshots
- Returns test results to Coder Agent for fixes

### 5.4 Deployer Agent
- Generates vercel.json / netlify.toml
- Creates GitHub repo (optional)
- Triggers deployment
- Returns live URL

## 6. Sandbox Security

- Each forge runs in isolated Docker container
- Resource limits: 512MB RAM, 0.5 CPU, 5 min timeout
- No network access to internal resources
- Ephemeral storage (cleared after each run)
- Container killed after timeout

## 7. UI/UX Design

### 7.1 Color Palette
- Primary: #6366F1 (Indigo)
- Secondary: #8B5CF6 (Violet)
- Accent: #10B981 (Emerald)
- Background: #09090B (Zinc 950)
- Surface: #18181B (Zinc 900)
- Text: #FAFAFA (Zinc 50)

### 7.2 Layout
- Max-width: 1400px centered
- Responsive: Mobile-first
- Navigation: Fixed top bar with sidebar on dashboard

## 8. Deployment

### 8.1 Docker Compose
- `app`: Next.js production build
- `api`: FastAPI with uvicorn
- `redis`: Redis queue
- `sandbox`: Docker-in-Docker for container management

### 8.2 CI/CD (GitHub Actions)
- Lint and type-check on PR
- Run tests
- Build Docker images
- Deploy to staging on merge to main

## 9. License

MIT License - see LICENSE file
