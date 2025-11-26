import os
import chromadb
from fastapi import UploadFile

from pypdf import PdfReader
from docx import Document
from sentence_transformers import SentenceTransformer

# Initialize ChromaDB
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("docs")

# Load embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text(file: UploadFile):
    ext = os.path.splitext(file.filename)[1].lower()

    if ext == ".pdf":
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    elif ext == ".docx":
        doc = Document(file.file)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text

    else:
        return None
