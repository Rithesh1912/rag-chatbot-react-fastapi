from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware

# Import RAG functions
from document_rag import extract_text, embedder, collection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str



@app.post("/chat")
def chat(req: ChatRequest):
    payload = {
        "model": "llama3",
        "prompt": req.message,
        "stream": False
    }

    response = requests.post(
        "http://localhost:11434/api/generate",
        json=payload
    )

    result = response.json()
    return {"reply": result.get("response", "")}



@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    text = extract_text(file)

    if not text:
        return {"error": "Unsupported file type"}

    # Create chunks
    chunks = [text[i:i+500] for i in range(0, len(text), 500)]

    # Create embeddings
    embeddings = embedder.encode(chunks).tolist()

    # Store in ChromaDB
    ids = [f"{file.filename}_{i}" for i in range(len(chunks))]
    collection.add(ids=ids, embeddings=embeddings, documents=chunks)

    return {"message": "File uploaded successfully", "chunks": len(chunks)}

@app.post("/ask-document")
def ask_document(req: ChatRequest):
    # 1. Search ChromaDB using user question
    search = collection.query(
        query_texts=[req.message],
        n_results=3
    )

    docs = search["documents"][0]

    # 2. Build a prompt for Llama (RAG)
    context = "\n\n".join(docs)

    prompt = f"""
You are a document question-answering bot.
Use only the information from the context below.

Context:
{context}

Question: {req.message}

Answer:
"""

    # 3. Call Llama (Ollama) using REST API
    payload = {
        "model": "llama3",
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(
        "http://localhost:11434/api/generate",
        json=payload
    )

    result = response.json()
    return {
        "answer": result.get("response", ""),
        "context_used": docs
    }



@app.get("/chroma-data")
def get_chroma_data():
    all_data = collection.get()
    return all_data
