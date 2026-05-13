import json
import numpy as np
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
import os

def build_index():
    print("Loading papers dataset...")
    data_path = '../data/papers.json'
    
    if not os.path.exists(data_path):
        print(f"Error: Could not find {data_path}")
        return
        
    with open(data_path, 'r') as f:
        papers = json.load(f)
        
    df = pd.DataFrame(papers)
    print(f"Loaded {len(df)} papers.")
    
    # Create the text to embed: Combining Title and Abstract
    df['text_to_embed'] = df['title'] + " " + df['abstract']
    
    print("Loading Sentence Transformer model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Generating dense vector embeddings... (this might take a moment)")
    embeddings = model.encode(df['text_to_embed'].tolist(), show_progress_bar=True)
    embeddings = np.array(embeddings).astype('float32')
    
    # Normalize vectors for Cosine Similarity (Inner Product)
    faiss.normalize_L2(embeddings)
    
    dimension = embeddings.shape[1]
    print(f"Vector dimensions: {dimension}")
    
    print("Building FAISS Index...")
    # IndexFlatIP uses Inner Product -> with normalized vectors this is Cosine Similarity
    index = faiss.IndexFlatIP(dimension)
    
    # Add vectors to index
    index.add(embeddings)
    
    print(f"Index built! Total vectors indexed: {index.ntotal}")
    
    # Save the index to disk
    faiss.write_index(index, "papers_index.faiss")
    print("Successfully saved FAISS index to 'papers_index.faiss'")

if __name__ == "__main__":
    build_index()
