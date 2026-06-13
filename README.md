# SN Toolkit — ServiceNow Developer Productivity

AI-powered toolkit that turns business requirements into production-ready ServiceNow artifacts.

## Stack
- **Frontend** — React + Vite + Tailwind CSS → deployed on **Vercel**
- **Backend** — Express + Node.js + Anthropic SDK → deployed on **Render**
- **Database** — Supabase (Postgres) → artifact history

## Local Development

### 1. Clone & install
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Environment variables

**backend/.env**
```
GROQ_API_KEY=gsk_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run
```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open http://localhost:5173

---

## Deployment

### Supabase (Database)
1. Go to https://supabase.com → New Project
2. Open SQL Editor → paste contents of `supabase/migrations/001_init.sql` → Run
3. Copy Project URL + service_role key (Settings → API)

### Render (Backend)
1. Push repo to GitHub
2. Go to https://render.com → New Web Service → connect repo
3. Render auto-detects `render.yaml` — just add env vars:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `FRONTEND_URL` (your Vercel URL, e.g. https://sn-toolkit.vercel.app)
4. Deploy — note your Render URL (e.g. https://sn-toolkit-api.onrender.com)

### Vercel (Frontend)
1. Go to https://vercel.com → New Project → import repo
2. Set **Root Directory** to `frontend`
3. Add env vars:
   - `VITE_API_URL` = your Render URL (e.g. https://sn-toolkit-api.onrender.com)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

---

## Features
- Generate **Tables** — field schemas, types, indexes, role definitions
- Generate **Flows** — Flow Designer logic with triggers, steps, error handling
- Generate **Catalog Items** — variables, SLAs, approval rules, UI policies
- Generate **ACLs** — role-based access rules, data policies, security recommendations
- **History sidebar** — all generated artifacts saved per session
- **Copy buttons** — copy any artifact as JSON
- **Supabase persistence** — history saved across sessions
