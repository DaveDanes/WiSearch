import { Paper, ValidationResult } from '../types';
import { papers } from '../data/papers';

/**
 * Validates the dataset integrity simulating the CSV checks.
 * Checks for missing values, valid years, and URL formats.
 */
export const validateDataset = (): ValidationResult => {
  try {
    if (!papers || papers.length === 0) {
      return { isValid: false, error: "Dataset is empty." };
    }

    for (const paper of papers) {
      if (!paper.title || paper.title.trim() === "") {
        console.error(`Row ID ${paper.id}: Missing title.`);
        return { isValid: false, error: `Row ID ${paper.id}: Missing title.` };
      }
      if (!paper.abstract || paper.abstract.trim() === "") {
        console.error(`Row ID ${paper.id}: Missing abstract.`);
        return { isValid: false, error: `Row ID ${paper.id}: Missing abstract.` };
      }
      if (!Number.isInteger(paper.year)) {
         console.error(`Row ID ${paper.id}: Year must be an integer.`);
         return { isValid: false, error: `Row ID ${paper.id}: Invalid year format.` };
      }
      if (!paper.url || !paper.url.startsWith("http")) {
         console.error(`Row ID ${paper.id}: Invalid URL.`);
         return { isValid: false, error: `Row ID ${paper.id}: Invalid URL format.` };
      }
    }
    
    return { isValid: true };
  } catch (e: any) {
    return { isValid: false, error: `Dataset load failed: ${e.message}` };
  }
};

/**
 * Validates if a user's query is somewhat related to our domain to prevent completely irrelevant searches
 */
export const isDomainRelevant = (query: string): boolean => {
  const lowerQuery = query.toLowerCase().trim();
  if (lowerQuery.length < 3) return false;

  // We check against a broad list of AI, ML, Cloud, and computer science concepts
  const validConcepts = [
    "ai", "ml", "artificial", "intelligence", "machine", "learning", "deep", "neural", 
    "network", "nlp", "bert", "transformer", "vision", "image", "cloud", "data", 
    "scale", "server", "distributed", "model", "language", "understand", "text", 
    "computer", "teach", "learn", "algorithm", "prediction", "robot", "math",
    "search", "information", "retrieval", "semantic", "vector", "embedding", 
    "faiss", "framework", "architecture", "system", "database", "graph", "generative"
  ];

  // Tokenize query
  const queryWords = lowerQuery.split(/[\s,]+/);

  // If any word in the query matches or partially matches our valid concepts, we let it pass.
  // This is a permissive check.
  for (const word of queryWords) {
    if (validConcepts.some(concept => word.includes(concept) || concept.includes(word))) {
      // additional check to avoid short matches like "a" matching "ai"
      if (word.length >= 2 || word === "ai" || word === "ml") {
        return true;
      }
    }
  }

  // Also check if any word from query exists exactly in any paper's title or abstract 
  // as a fallback for niche terms we didn't list in validConcepts.
  for (const paper of papers) {
    const title = paper.title.toLowerCase();
    const abstract = paper.abstract.toLowerCase();
    for (const word of queryWords) {
      if (word.length > 3 && (title.includes(word) || abstract.includes(word))) {
        return true;
      }
    }
  }

  return false;
};

/**
 * INTELLIGENT SEMANTIC SEARCH (Hybrid Fallback)
 * 1. Tries to connect to the Python FAISS micro-backend
 * 2. If backend is offline, gracefully falls back to TS simulated search
 */
export const simulateVectorSearch = async (query: string): Promise<Paper[]> => {
  if (!query) return [];

  try {
    // 1. Attempt connection to Python Micro-Backend FAISS + SentenceTransformers
    const response = await fetch(`http://localhost:8000/api/search?query=${encodeURIComponent(query)}&top_k=6`);
    if (response.ok) {
      const data = await response.json();
      console.log("Connected to Python FAISS Backend!");
      return data.results.map((p: any) => ({
        ...p,
        relevanceScore: Math.round(p.score * 100) // Mapping FAISS 0-100 to frontend 0-10000 
      }));
    }
  } catch (backendError) {
    console.log("Python Backend offline or unreachable. Falling back to TS Simulated Search.");
  }

  // 2. FALLBACK: SIMULATION OF HYBRID SEARCH (Semantic + Lexical BM25)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const lowerQuery = query.toLowerCase().trim();
        const originalTerms = lowerQuery.split(/\s+/).filter(t => t.length > 2);
        
        // 1. Semantic Concept Mapping (Simulating Vector Proximity)
        const semanticExpansions: string[] = [];
        
        // Concept: General AI / ML
        if (lowerQuery.includes("what is ai") || lowerQuery.includes("artificial intelligence") || lowerQuery.includes("teach computer") || lowerQuery.includes("intelligent") || lowerQuery.includes("how do computers learn") || lowerQuery.includes("machine learning")) {
          semanticExpansions.push("machine learning", "neural", "deep learning", "ai/nlp", "model");
        }
        
        // Concept: Neural Networks & Deep Learning
        if (lowerQuery.includes("neural network") || lowerQuery.includes("deep learning") || lowerQuery.includes("brain") || lowerQuery.includes("layer")) {
          semanticExpansions.push("neural", "network", "deep", "layer", "convolutional", "recurrent");
        }

        // Concept: NLP & Text
        if (lowerQuery.includes("language") || lowerQuery.includes("text") || lowerQuery.includes("word") || lowerQuery.includes("translation") || lowerQuery.includes("understand") || lowerQuery.includes("nlp")) {
          semanticExpansions.push("nlp", "transformer", "bert", "representation", "sequence", "semantic");
        }

        // Concept: Vision & Images
        if (lowerQuery.includes("image") || lowerQuery.includes("vision") || lowerQuery.includes("picture") || lowerQuery.includes("see")) {
          semanticExpansions.push("convolutional", "cnn", "visual", "recognition");
        }

        // Concept: Search & Retrieval
        if (lowerQuery.includes("search") || lowerQuery.includes("find") || lowerQuery.includes("similar") || lowerQuery.includes("database")) {
          semanticExpansions.push("retrieval", "faiss", "vector", "dense", "index");
        }

        // Concept: Cloud & Scale
        if (lowerQuery.includes("cloud") || lowerQuery.includes("server") || lowerQuery.includes("scale") || lowerQuery.includes("big data")) {
          semanticExpansions.push("distributed", "storage", "cluster", "aws", "elastic");
        }

        // Generate independent scores for Lexical and Semantic engines
        const scoredPapers = papers.map(paper => {
          let lexicalScore = 0;
          let semanticScore = 0;

          const lowerTitle = paper.title.toLowerCase();
          const lowerAbstract = paper.abstract.toLowerCase();
          const lowerDomain = paper.domain.toLowerCase();
          const lowerAuthors = paper.authors.toLowerCase();

          // Phase A: Lexical Scoring (Simulating BM25) 
          // Pure keyword/phrase matches
          if (lowerTitle.includes(lowerQuery)) lexicalScore += 100;
          if (lowerAbstract.includes(lowerQuery)) lexicalScore += 60;
          if (lowerAuthors.includes(lowerQuery)) lexicalScore += 80;

          originalTerms.forEach(term => {
            if (lowerTitle.includes(term)) lexicalScore += 20;
            if (lowerAbstract.includes(term)) lexicalScore += 10;
            if (lowerDomain.includes(term)) lexicalScore += 15;
            if (lowerAuthors.includes(term)) lexicalScore += 30;
          });

          // Phase B: Semantic Scoring (Simulating FAISS Vector Distance)
          // Scores based on conceptual expansion
          semanticExpansions.forEach(term => {
            if (lowerTitle.includes(term)) semanticScore += 25;
            if (lowerAbstract.includes(term)) semanticScore += 15;
            if (lowerDomain.includes(term)) semanticScore += 30;
          });

          // Recency boost applies to both mildly, ONLY if there's already a match
          if (paper.year > 2020) {
            if (lexicalScore > 0) lexicalScore += 5;
            if (semanticScore > 0) semanticScore += 5;
          }

          return { ...paper, lexicalScore, semanticScore, rrfScore: 0 };
        });

        // Phase C: Reciprocal Rank Fusion (RRF)
        // 1. Sort and rank by Lexical
        const lexicalRanked = [...scoredPapers].sort((a, b) => b.lexicalScore - a.lexicalScore);
        const semanticRanked = [...scoredPapers].sort((a, b) => b.semanticScore - a.semanticScore);
        
        const k = 60; // Standard RRF constant
        
        const rrfPapers = scoredPapers.map(paper => {
          const lexIndex = lexicalRanked.findIndex(p => p.id === paper.id) + 1;
          const semIndex = semanticRanked.findIndex(p => p.id === paper.id) + 1;
          
          const rrfScore = 
            (paper.lexicalScore > 0 ? 1 / (k + lexIndex) : 0) + 
            (paper.semanticScore > 0 ? 1 / (k + semIndex) : 0);

          return { 
            ...paper, 
            relevanceScore: Math.round(rrfScore * 10000) // Multiply to make UI score readable
          };
        });

        // Filter and sort by final Hybrid RRF score
        const results = rrfPapers
          .filter(p => p.relevanceScore > 0)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 6);

        resolve(results);
      } catch (error) {
        reject(new Error("Failed to process hybrid search."));
      }
    }, 1200);
  });
};
