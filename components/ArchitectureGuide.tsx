import React from 'react';

const ArchitectureGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Phase 2: The Embedding Pipeline</h2>
          <p className="text-slate-300">How we turn text into math (Vectors)</p>
        </div>
        
        <div className="p-8">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              The Concept: Vector Embeddings
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Computers don't understand English. To compare "Dog" and "Puppy", we need to convert them into numbers.
              A <strong>Vector Embedding</strong> is a list of numbers (e.g., [0.1, -0.5, 0.8...]) that represents the <em>meaning</em> of a sentence.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 font-mono text-sm text-slate-600 mb-4">
              Query: "Neural Networks" <br/>
              Vector: [0.041, -0.021, 0.943, ... 381 more numbers]
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Why all-MiniLM-L6-v2?</strong> It's a "Sentence Transformer". Unlike standard BERT (which gives embeddings for every word), this model is trained specifically to create a single high-quality vector for a whole sentence. It is fast (Mini) and accurate enough for our 55 papers.
            </p>
          </div>

          <div className="mb-10">
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Phase 2 Code: Generating Embeddings
            </h3>
            <p className="text-sm text-slate-500 mb-2">This is the exact Python code logic used to prepare the data:</p>
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs text-slate-400 font-mono">pipeline.py</span>
              </div>
              <pre className="p-4 text-sm font-mono text-blue-100 overflow-x-auto">
{`from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np

# 1. Load the Data
df = pd.read_csv("research_papers.csv")
# We combine Title + Abstract to get the most "signal" for the vector
df['text_to_embed'] = df['title'] + " " + df['abstract']

# 2. Load the Model
# all-MiniLM-L6-v2 maps sentences to a 384 dimensional dense vector space
model = SentenceTransformer('all-MiniLM-L6-v2')

# 3. Generate Embeddings
# This creates a matrix of size (55, 384)
embeddings = model.encode(df['text_to_embed'].tolist())

# 4. Save for Phase 3 (FAISS)
np.save("paper_embeddings.npy", embeddings)`}
              </pre>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
              <strong>Viva Defense:</strong> "I chose to embed both Title and Abstract because the title is precise but short, while the abstract contains the context. Combining them gives the model the best chance to capture the full semantic meaning."
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Phase 3: FAISS Indexing
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use <strong>IndexFlatL2</strong> (or IP/Cosine) for 55 items because it's brute-force accurate and instant for small data.
            </p>
             <pre className="bg-slate-100 p-4 rounded text-sm text-slate-700 font-mono">
{`import faiss
dimension = 384
index = faiss.IndexFlatL2(dimension) 
index.add(embeddings) # Add vectors to the index`}
             </pre>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArchitectureGuide;
