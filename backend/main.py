from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pandas as pd
import json
import os

app = FastAPI(title="WiSearch Semantic API")

# Update CORS for local frontend execution
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold model, index, and data
MODEL_NAME = 'all-MiniLM-L6-v2'
model = None
index = None
papers_df = None

@app.on_event("startup")
async def startup_event():
    global model, index, papers_df
    print("Loading Sentence Transformer model...")
    # Load the requested model from the synopsis
    model = SentenceTransformer(MODEL_NAME)
    
    # Check if index exists, and load data if present
    if os.path.exists('papers_index.faiss') and os.path.exists('../data/papers.json'):
        print("Loading FAISS index...")
        index = faiss.read_index('papers_index.faiss')
        
        with open('../data/papers.json', 'r') as f:
            papers_data = json.load(f)
            papers_df = pd.DataFrame(papers_data)
        print(f"Loaded {len(papers_df)} papers and FAISS index.")
    else:
        print("Warning: FAISS index not found. Run index_builder.py first.")

@app.get("/api/health")
def health_check():
    if model is None or index is None:
        return {"status": "degraded", "message": "Model or Index not loaded"}
    return {"status": "ok", "message": "Sentence Transformers and FAISS ready"}

@app.get("/api/search")
def search_papers(query: str, top_k: int = 5):
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
        
    if model is None or index is None:
        raise HTTPException(status_code=500, detail="Search engine not fully initialized. Ensure FAISS index exists.")
    
    # 1. Encode query into semantic vector
    query_vector = model.encode([query])
    query_vector = np.array(query_vector).astype('float32')
    
    # Normalize query for cosine similarity (if index is IndexFlatIP)
    faiss.normalize_L2(query_vector)
    
    # 2. Perform vector search
    # FAISS returns distances and indices
    distances, indices = index.search(query_vector, top_k)
    
    results = []
    # 3. Map indices back to paper metadata
    for i, idx in enumerate(indices[0]):
        if idx != -1 and idx < len(papers_df):
            paper_data = papers_df.iloc[idx].to_dict()
            
            # Convert FAISS distance to a 0-100 score format (simplified normalization)
            # For exact L2 or IP distances, you can map it to percentage here.
            score = round((float(distances[0][i]) + 1.0) / 2.0 * 100, 1) if distances[0][i] <= 1.0 else 95.0
            
            paper_data['score'] = score
            results.append(paper_data)
            
    return {"query": query, "results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
