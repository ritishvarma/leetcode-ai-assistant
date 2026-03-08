# AlgoMentor AI

RAG-based AI assistant for LeetCode problem solving.

## Structure

```
├── frontend/          # Next.js app
├── backend/           # FastAPI + RAG
└── vercel.json
```

## Deployment

### Frontend (Vercel)

1. Import project from GitHub
2. **Set Root Directory to `frontend`** in Settings → Build & Development Settings
3. Add env var: `NEXT_PUBLIC_API_URL` (backend URL)
4. Deploy

### Backend (Render/Railway)

1. Deploy `backend` folder
2. Add env vars: `HF_TOKEN`, `ALLOWED_ORIGINS`
3. Deploy

## Local Dev

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
