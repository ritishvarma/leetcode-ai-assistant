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

### Frontend (Vercel)
The frontend Next.js application is configured to be seamlessly deployed on Vercel. 
1. Push the repository to GitHub.
2. Import the `frontend` folder into a new Vercel project.
3. Configure the `NEXT_PUBLIC_API_URL` environment variable if your backend is hosted externally.

### Backend (Render)
The FastAPI backend can be deployed on Render using a Web Service.
1. Create a new Web Service on Render linked to this repository.
2. Set the Root Directory to `backend`.
3. Set the Start Command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the `HF_TOKEN` environment variable.
5. In your frontend configuration, ensure it points to the deployed Render URL as the API endpoint.
