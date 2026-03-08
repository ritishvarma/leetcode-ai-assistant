from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline import RAGPipeline
import traceback

app = FastAPI(title="AlgoMentor AI Backend")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = None

@app.on_event("startup")
def startup_event():
    global pipeline
    try:
        pipeline = RAGPipeline()
    except Exception as e:
        print(f"Failed to initialize RAG Pipeline: {e}")

class ChatRequest(BaseModel):
    question: str
    model: str = "deepseek-ai/deepseek-coder-33b-instruct"

class ChatResponse(BaseModel):
    answer: str
    similar_problems: list[str]

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not pipeline:
        raise HTTPException(status_code=500, detail="RAG Pipeline not initialized. Check if index exists.")
        
    try:
        response_data = pipeline.generate_response(request.question, request.model)
        return response_data
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "pipeline_initialized": pipeline is not None}
