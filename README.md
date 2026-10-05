# Energy Project Readiness ⚡

> **AI-assisted project controls and stage-readiness prototype for utility-scale solar PV and battery storage projects.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-16a34a?style=for-the-badge&logo=render)](https://energy-project-readiness.onrender.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**Status: MVP / Proof of Concept**

[Live Demo](https://energy-project-readiness.onrender.com/)

---

## Why this project?

Renewable-energy projects move through multiple development workstreams, including site control, grid interconnection, permitting, commercial structuring, procurement, and construction.

When project information is spread across spreadsheets, notes, and separate workflows, it can become difficult to see what is actually blocking progress.

**Energy Project Readiness** explores a simple idea:

> **Make project blockers visible, connect them to development stages, and use AI to turn project context into actionable next steps.**

The current version is a demonstration/prototype. It uses synthetic project data and is intended to explore the workflow and product concept, not to replace production project controls, engineering, regulatory, or financial systems.

---

## What the MVP demonstrates

### Project control center

A single view of a project showing:

- project identity, location, solar capacity, and battery capacity
- overall readiness
- active blockers
- active risks
- current development gate

### Six-stage development lifecycle

Projects are organized into six development stages:

```text
Site → Grid → Permits → Commercial → Procurement → Construction
```

Each stage contains development tasks and has a transparent readiness percentage based on completed tasks.

### Blocker tracking

Tasks can be marked as blocked or flagged as blockers. Active blockers are surfaced to the project-level view so the user can quickly identify what needs attention.

### Interactive task management

Users can:

- change task status
- flag or clear blockers
- update owners and notes
- add tasks to a stage
- remove tasks

Changes are persisted through the Flask REST API, and readiness is recalculated from the backend.

### AI-assisted project risk assessment

The application can send the current project context to Google Gemini and return a structured assessment containing:

- executive summary
- current blockers
- major risks
- recommended next actions

A deterministic mock provider is also available when no Gemini API key is configured, allowing the demo workflow to run without an external AI dependency.

### Project notes and records

Project notes can be associated with a specific development stage. These records can be included in the AI analysis so qualitative project context can inform the assessment.

---

## Example project

The demo uses a synthetic utility-scale project:

**Solaria Desert Solar + BESS**  
**Location:** Kern County, CA  
**Solar:** 150 MW  
**Battery:** 60 MWh

The seeded project includes example development tasks and blockers across grid interconnection, permitting, procurement, and other stages.

> **Note:** The demo project and its project-specific details are synthetic and should not be interpreted as an actual development project or representation of a real company's internal data.

---

## How readiness is calculated

Readiness is deliberately deterministic and does not depend on AI.

### Stage readiness

```text
Stage Readiness (%) = completed tasks / total tasks × 100
```

### Overall project readiness

The overall score is the average of the six stage-readiness percentages.

This keeps the calculation transparent and predictable while the AI layer is used for qualitative risk analysis and recommendations.

---

## Architecture

```text
┌──────────────────────────────┐
│        React + Vite          │
│   Dashboard / Task UI / AI   │
└──────────────┬───────────────┘
               │ REST / JSON
               ▼
┌──────────────────────────────┐
│         Flask API            │
│ Projects / Stages / Tasks    │
│ Notes / Risk Analysis        │
└───────┬───────────────┬──────┘
        │               │
        ▼               ▼
┌──────────────┐  ┌─────────────────────┐
│ SQLAlchemy   │  │     AI Service      │
│    + SQLite  │  │                     │
└──────────────┘  │ Gemini / Mock       │
                  └─────────────────────┘
```

### Design principles

- **Backend as source of truth:** readiness and project state are calculated on the server.
- **Deterministic readiness:** the numerical readiness score is rule-based, not AI-generated.
- **Pluggable AI provider:** Gemini is isolated behind an AI-provider interface so the application can use a mock provider without changing route logic.
- **REST separation:** React communicates with Flask through JSON APIs.
- **Demo-first deployment:** the current MVP is packaged to run as a single Render web service.

---

## Tech stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18, Vite | Single-page application |
| Styling | Tailwind CSS, Lucide Icons | UI styling and interface components |
| Backend | Python, Flask | REST API and application logic |
| ORM | SQLAlchemy | Database models and relationships |
| Database | SQLite | Lightweight MVP storage |
| AI | Google Gemini via `google-genai` | Project risk analysis |
| Fallback AI | Mock provider | Offline/demo-safe analysis |
| WSGI | Gunicorn | Production application server |
| Hosting | Render | Public deployment |

---

## Project structure

```text
energy-project-readiness/
├── backend/
│   ├── app/
│   │   ├── models/            # Project, Stage, Task, Note, Analysis models
│   │   ├── routes/            # REST API blueprints
│   │   └── services/          # Readiness logic, AI providers, default tasks
│   ├── run.py                 # Flask application entrypoint
│   ├── requirements.txt       # Python dependencies
│   └── test_production_readiness.py
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Dashboard and workspace components
│   │   ├── api/               # Centralized API client
│   │   └── App.jsx            # Main application shell
│   ├── package.json
│   └── vite.config.js
│
├── build.sh                   # Production build script
├── render.yaml                # Render deployment configuration
└── Procfile                   # Gunicorn entrypoint
```

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/projects` | List projects with summary metrics |
| `POST` | `/api/projects` | Create a project and initialize its stages/tasks |
| `GET` | `/api/projects/<id>` | Retrieve a project's stages, tasks, readiness, and blockers |
| `DELETE` | `/api/projects/<id>` | Delete a project |
| `GET` | `/api/projects/<id>/stages` | Retrieve stage details and tasks |
| `POST` | `/api/stages/<id>/tasks` | Add a task to a stage |
| `PATCH` | `/api/tasks/<id>` | Update task status, blocker flag, owner, notes, or metadata |
| `DELETE` | `/api/tasks/<id>` | Delete a task |
| `GET` | `/api/projects/<id>/documents` | Retrieve project notes/records |
| `POST` | `/api/projects/<id>/documents` | Create a project note/record |
| `DELETE` | `/api/documents/<id>` | Delete a note/record |
| `POST` | `/api/projects/<id>/analyze-risks` | Run AI-assisted project risk analysis |
| `GET` | `/api/projects/<id>/analysis/latest` | Retrieve the latest saved risk analysis |
| `POST` | `/api/demo/seed` | Seed/reload the reference demo project |

---

## Local development

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Damianson/energy-project-readiness.git
cd energy-project-readiness
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
```

On Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file from the example:

```bash
cp .env.example .env
```

Add a Gemini API key when you want to use live Gemini analysis:

```env
GEMINI_API_KEY=your_key_here
```

Without the key, the application can use the mock provider.

Seed the demo project:

```bash
python seed_data.py
```

Start the API:

```bash
PORT=5000 python run.py
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs on the configured frontend port and proxies API requests to Flask.

---

## Verification

A production-readiness test script is included:

```bash
cd backend
python test_production_readiness.py
```

The verification suite checks core deployment and application behavior, including:

1. React production build asset serving and SPA fallback.
2. Demo project recreation on a fresh database.
3. Mock AI fallback when `GEMINI_API_KEY` is unavailable.
4. Gunicorn entrypoint compatibility.
5. Core project endpoints and database integrity.

Manual verification should also cover:

- creating and loading a project
- changing task status
- toggling blockers
- readiness recalculation
- adding project notes
- running AI risk analysis
- retrieving the latest saved analysis

---

## Deploying to Render

The repository includes Render deployment configuration.

### Build command

```bash
./build.sh
```

### Start command

```bash
gunicorn --chdir backend run:app
```

### Environment variables

```text
GEMINI_API_KEY   # optional; enables live Gemini analysis
FLASK_DEBUG=false
PYTHON_VERSION=3.11.9
```

When `GEMINI_API_KEY` is omitted, the application can fall back to the deterministic mock provider.

### Important MVP note

The current MVP uses SQLite. That is appropriate for local development and the current demonstration workflow, but a production multi-user deployment would normally use a persistent managed relational database such as PostgreSQL.

---

## Product direction

The current prototype focuses on one core question:

> **What is blocking this project from moving to the next stage?**

Possible future directions include deeper document processing, richer project controls, integrations with external data sources, persistent production databases, and more advanced readiness/risk models.

Those capabilities are intentionally outside the scope of the current MVP.

---

## License

This project is licensed under the [MIT License](LICENSE).