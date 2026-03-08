# AlgoMentor AI

AlgoMentor AI is a production-ready RAG (Retrieval Augmented Generation) web application that acts as a coding interview mentor. It helps users solve coding interview problems by giving hints, pattern explanations, and similar problems without giving away the direct solution.

## Features

- **Next.js Frontend**: Modern Chat UI with dark mode.
- **FastAPI Backend**: Fast, asynchronous REST API.
- **RAG Pipeline**: SentenceTransformers + FAISS for document retrieval.
- **LLM Integration**: Hugging Face Inference API powered by DeepSeek Coder for intelligent mentoring.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) 3.10+
- [Hugging Face Access Token](https://huggingface.co/settings/tokens)

---

## Getting Started

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` directory and add your Hugging Face API key:
   ```bash
   HF_TOKEN=your_hugging_face_token_here
   ```
5. Run the data ingestion script to build the vector database:
   ```bash
   python ingest.py
   ```
6. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
The backend should now be running on `http://localhost:8000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
The frontend should now be running on `http://localhost:3000`.

---

## Deployment

This application is ready for production deployment!

### Quick Deploy

1. **Backend**: Deploy to Render, Railway, or Fly.io
   - Set environment variables: `HF_TOKEN`, `ALLOWED_ORIGINS`
   - Ensure `faiss_index.bin` and `metadata.json` are committed

2. **Frontend**: Deploy to Vercel
   - Set environment variable: `NEXT_PUBLIC_API_URL` (your backend URL)
   - Vercel will auto-detect Next.js configuration

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Environment Variables

**Backend** (`backend/.env`):
```bash
HF_TOKEN=your_hugging_face_token
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

See `.env.example` files for templates.
