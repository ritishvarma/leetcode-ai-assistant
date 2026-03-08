import json
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

DATASET_PATH = "dataset.json"
FAISS_INDEX_PATH = "faiss_index.bin"
METADATA_PATH = "metadata.json"

def main():
    print("Loading dataset...")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        problems = json.load(f)
    
    print("Initializing SentenceTransformer model...")
    # Using a fast, lightweight embedding model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    texts_to_embed = []
    metadata = []
    
    print("Preparing documents...")
    for prob in problems:
        # Create a rich text representation for the embedding
        text_repr = f"Title: {prob['title']}\n" \
                    f"Pattern: {prob['pattern']}\n" \
                    f"Description: {prob['description']}\n" \
                    f"Approach: {prob['approach']}"
        texts_to_embed.append(text_repr)
        metadata.append(prob)
        
    print(f"Computing embeddings for {len(texts_to_embed)} documents...")
    embeddings = model.encode(texts_to_embed, show_progress_bar=True)
    embeddings = np.array(embeddings).astype('float32')
    
    # Normalize for cosine similarity (inner product)
    faiss.normalize_L2(embeddings)
    
    print("Creating FAISS index...")
    # dimensionality of 'all-MiniLM-L6-v2' is 384
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings)
    
    print(f"Saving FAISS index to {FAISS_INDEX_PATH}...")
    faiss.write_index(index, FAISS_INDEX_PATH)
    
    print(f"Saving metadata to {METADATA_PATH}...")
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    print("Ingestion complete!")

if __name__ == "__main__":
    main()
