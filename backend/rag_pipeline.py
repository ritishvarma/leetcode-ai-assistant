import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

class RAGPipeline:
    def __init__(self, index_path="faiss_index.bin", metadata_path="metadata.json"):
        print("Loading embedding model...")
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
        
        print(f"Loading FAISS index from {index_path}...")
        try:
            self.index = faiss.read_index(index_path)
        except Exception as e:
            print(f"Error loading FAISS index: {e}. Make sure to run ingest.py first.")
            self.index = None
            
        print(f"Loading metadata from {metadata_path}...")
        try:
            with open(metadata_path, 'r', encoding='utf-8') as f:
                self.metadata = json.load(f)
        except Exception as e:
            print(f"Error loading metadata: {e}")
            self.metadata = []
            
        hf_token = os.environ.get("HF_TOKEN")
        if not hf_token:
             print("Warning: HF_TOKEN not found in environment variables.")
        
        self.hf_client = InferenceClient(api_key=hf_token)
        
    def retrieve(self, query: str, top_k: int = 5):
        if not self.index or not self.metadata:
            return []
            
        # Encode query
        query_vector = self.encoder.encode([query])
        query_vector = np.array(query_vector).astype('float32')
        faiss.normalize_L2(query_vector)
        
        # Search index
        distances, indices = self.index.search(query_vector, top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.metadata):
                results.append({
                    "score": float(distances[0][i]),
                    "document": self.metadata[idx]
                })
        return results

    def generate_response(self, query: str, model_name: str = "deepseek-ai/deepseek-coder-33b-instruct"):
        retrieved_docs = self.retrieve(query)
        
        context_str = ""
        for i, res in enumerate(retrieved_docs):
            doc = res['document']
            context_str += f"Problem {i+1}:\n"
            context_str += f"Title: {doc['title']}\n"
            context_str += f"Description: {doc['description']}\n"
            context_str += f"Pattern: {doc['pattern']}\n"
            context_str += f"Approach: {doc['approach']}\n"
            context_str += f"Time Complexity: {doc['time_complexity']}\n\n"

        system_prompt = (
            "You are an expert competitive programming assistant that solves LeetCode problems.\n\n"
            "When the user provides a problem or coding question, follow these rules strictly:\n"
            "1. Determine the best programming language for the solution or use the language explicitly requested by the user.\n"
            "2. Always display the programming language above the code.\n"
            "3. Format the code inside a proper markdown code block using the correct language tag.\n"
            "4. If the language is Python, the solution MUST follow LeetCode's required format:\n"
            "class Solution:\n"
            "    def functionName(self, parameters):\n"
            "        # implementation\n"
            "5. For other languages (C++, Java, JavaScript, etc.), follow the exact structure expected by LeetCode.\n"
            "6. The code must be clean, correct, and optimized.\n"
            "7. Never include explanations inside the code block.\n\n"
            "Output format must always follow this structure:\n\n"
            "Explanation:\n"
            "Briefly explain the approach.\n\n"
            "Language: <programming language name>\n\n"
            "Code:\n"
            "```language\n"
            "<complete solution>\n"
            "```\n\n"
            "Time Complexity: <Big-O time complexity>\n\n"
            "Space Complexity: <Big-O space complexity>\n\n"
            f"Context Data:\n{context_str}"
        )

        response = self.hf_client.chat_completion(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            temperature=0.7,
            max_tokens=1024
        )
        
        return {
            "answer": response.choices[0].message.content,
            "similar_problems": [doc['document']['title'] for doc in retrieved_docs[:3]]
        }
