# Energy Project Readiness ⚡

> **Enterprise-grade clean energy project controls and stage-gate readiness platform for utility-scale solar PV and battery storage (BESS) assets.**

[![Live Application](https://img.shields.io/badge/Live%20Demo-Render-16a34a?style=for-the-badge&logo=render)](https://energy-project-readiness.onrender.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Backend-Flask%203.x-black?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![Gemini](https://img.shields.io/badge/AI%20Engine-Google%20Gemini-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌐 Live Demo

The application is deployed and running in production on Render:  
🔗 **[https://energy-project-readiness.onrender.com/](https://energy-project-readiness.onrender.com/)**

---

## 📌 Executive Summary

Developing utility-scale renewable energy infrastructure takes between 3 to 7 years. Billions of dollars in project capital regularly stall because critical gate progress is buried in disconnected spreadsheets, siloed engineering memos, and offline communications.

**Energy Project Readiness** transforms scattered development data into a single, high-trust project controls center. Instead of vanity metrics, it answers the single operational question that matters most to developers, EPC contractors, and infrastructure investment committees:

> **"What is currently blocking this project from advancing to the next development gate and achieving Notice to Proceed (NTP)?"**

---

## 🚀 Key Features

### 1. Project-Control Center & Telemetry Summary
- **High-Density Asset Header:** Displays asset identity (`Solaria Desert Solar + BESS`), location (`Kern County, CA`), peak capacity (`150 MW Solar PV`), storage duration (`60 MWh BESS`), and active status.
- **Top Summary Strip:** Immediate operational metrics:
  - `READINESS`: Dynamically weighted project-wide readiness percentage (e.g. `12.5%`).
  - `CRITICAL BLOCKERS`: Active critical-path blockers halting milestones (e.g. `2 Open`).
  - `ACTIVE RISKS`: Tracked technical and regulatory risk exposures.
  - `CURRENT GATE`: Identifies the active bottleneck stage gate (e.g. `Grid Interconnection`).

### 2. Critical Path Blockers Engine
- **Dedicated Impact Ledger:** Focuses on deliverables marked as critical path impediments.
- **Operational Attribution:** Highlights exact schedule impacts (e.g., CAISO cluster study restudies, 14-month transformer lead times), responsible owners, and provides direct `Inspect →` navigation to the relevant stage gate.

### 3. Connected 6-Stage Development Lifecycle Pipeline
Follows the standard capital project development sequence:
```
[ 1. Site ]  →  [ 2. Grid ]  →  [ 3. Permits ]  →  [ 4. Commercial ]  →  [ 5. Procurement ]  →  [ 6. Construction ]
```
- **Weighted Stage Gates:** Each stage calculates deliverable completion ratios and weighted contributions to the overall asset readiness.
- **Status Indicators:** Immediate visual states for `Blocked`, `Complete`, `Active`, and `Pending`.

### 4. Interactive Stage Workspace & Deliverable Management
- **Enterprise Deliverable Register:** Clean list and table structure showing deliverable scope, technical criteria, owner, status, target due date, and critical blocker flags.
- **Inline Editing & Dynamic Recalculation:** Changing deliverable statuses or toggling critical blockers instantly recalculates stage readiness and overall project readiness in real time.
- **Deliverable Filters:** Filter deliverables by status: `All`, `Blocked`, `In Progress`, and `Complete`.
- **Field Notes Expander:** Expandable technical criteria and dependency details for each deliverable.

### 5. Project Risk Assessment (AI & Deterministic Engine)
- **Analytical Intelligence:** Powered by **Google Gemini** (with an automatic deterministic fallback for offline/development environments).
- **Context Synthesis:** Ingests the full project state — all 6 stages, active tasks, blocker flags, and qualitative engineering notes — and outputs a structured risk assessment:
  - **Executive Assessment:** Concise summary of gate readiness.
  - **Critical Path Blockers:** Filtered active impediments.
  - **Major Risks & Mitigations:** Prioritized exposure matrix (`Immediate`, `High`, `Medium`) with recommended mitigations.
  - **Recommended Next Actions:** Sequential prioritized action steps for the development team.

### 6. Engineering Log & Qualitative Project Records
- **Audit-Ready Operations Ledger:** Log technical memos, utility notices, and regulatory filings with timestamps, stage associations, and detailed notes.
- **AI Context Ingestion:** Notes are automatically fed into the AI Risk Assessment context, allowing qualitative field realities to influence risk ratings.
- **Two-Step Deletion Protection:** Inline confirmation prevents accidental removal of critical records.

---

## 🛠️ Technical Architecture & Stack

```
energy-project-readiness/
├── backend/
│   ├── app/
│   │   ├── models/            # SQLAlchemy database models (Project, Stage, Task, Document, Analysis)
│   │   ├── routes/            # REST API Blueprints (projects, stages, tasks, analysis, documents, demo)
│   │   └── services/          # Readiness calculation, AI providers (Gemini & Mock), default templates
│   ├── run.py                 # Application factory & WSGI entrypoint
│   ├── requirements.txt       # Python dependencies
│   └── test_production_readiness.py # Production verification test suite
├── frontend/
│   ├── src/
│   │   ├── components/        # Enterprise UI components (Navbar, ProjectHeader, BlockerBanner, etc.)
│   │   ├── api/               # API client for backend communication
│   │   └── App.jsx            # Main dashboard layout and state orchestration
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite build configuration & local API proxy
├── build.sh                   # Production build script (compiles frontend & installs backend)
├── render.yaml                # Render Infrastructure-as-Code Blueprint
└── Procfile                   # Process file for production WSGI server (Gunicorn)
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | High-performance single-page application (SPA) |
| **Styling** | Tailwind CSS, Lucide Icons | Clean, restrained enterprise industrial design system |
| **Typography** | Inter | High-legibility UI typography |
| **Backend API** | Python 3.11, Flask 3.x | Lightweight, modular REST API |
| **ORM / Database** | SQLAlchemy, SQLite | Persistent relational storage with automated schema creation |
| **AI Integration** | `google-genai` SDK | Operational risk synthesis via Gemini models |
| **WSGI Server** | Gunicorn | High-concurrency production HTTP application server |
| **Hosting** | Render | Production PaaS hosting via unified static & API serving |

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning service status. |
| `GET` | `/api/projects` | List all active energy projects with summary metrics. |
| `GET` | `/api/projects/<id>` | Retrieve full project details, including all 6 stages and deliverables. |
| `PATCH` | `/api/tasks/<id>` | Update deliverable status, critical blocker flag, owner, or notes. |
| `POST` | `/api/stages/<id>/tasks` | Add a new deliverable to a specific stage gate. |
| `DELETE` | `/api/tasks/<id>` | Delete a deliverable from a stage gate. |
| `POST` | `/api/projects/<id>/analysis` | Trigger a new operational risk assessment via the AI engine. |
| `GET` | `/api/projects/<id>/analysis/latest` | Retrieve the most recent risk assessment for a project. |
| `GET` | `/api/projects/<id>/documents` | Retrieve all engineering logs and qualitative records for a project. |
| `POST` | `/api/projects/<id>/documents` | Create a new engineering log or technical record. |
| `DELETE` | `/api/documents/<id>` | Delete an engineering log entry. |
| `POST` | `/api/demo/seed` | Idempotently seed or reload the reference utility-scale project. |

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js** (v18.x or higher) & **npm**
- **Python** (v3.10 or v3.11)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Damianson/energy-project-readiness.git
cd energy-project-readiness
```

### 2. Backend Setup
```bash
# Create and activate a Python virtual environment
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (optional for local mock mode)
cp .env.example .env  # Add GEMINI_API_KEY if testing live Gemini API

# Seed the reference project into the database
python seed_data.py

# Start the Flask API server (runs on http://localhost:5000)
PORT=5000 python run.py
```

### 3. Frontend Setup
```bash
# Open a new terminal in the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server (runs on http://localhost:3000)
npm run dev
```

The frontend will start on **`http://localhost:3000`** with automatic proxying to the Flask backend on port 5000.

---

## 🧪 Verification & Production Testing

A dedicated production-readiness verification test suite is included in the backend:

```bash
cd backend
python test_production_readiness.py
```

This verifies:
1. React production build asset serving and SPA routing fallback from Flask.
2. Idempotent demo project recreation on a fresh database.
3. Safe fallback to `MockAIProvider` when `GEMINI_API_KEY` is not present.
4. Gunicorn WSGI application entrypoint compatibility (`run:app`).
5. Core project endpoints and database integrity.

---

## 🚢 Deployment on Render

The repository is configured for one-click deployment on Render:

1. Connect your GitHub repository to Render as a **Web Service**.
2. Configure the deployment settings:
   - **Environment:** `Python`
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn --chdir backend run:app`
3. Optional Environment Variables:
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key. If omitted, the platform automatically uses the deterministic `MockAIProvider`.
   - `FLASK_DEBUG`: `false`
   - `PYTHON_VERSION`: `3.11.9`

The `build.sh` script automatically bundles the React frontend into `frontend/dist` and installs Python dependencies. Flask then serves the compiled SPA alongside the REST API from a single lightweight container.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
