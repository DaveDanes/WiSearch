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
 * SIMULATION OF HYBRID SEARCH (Semantic + Lexical BM25)
 * Combines exact keyword matching with semantic concept expansion
 * and merges them using Reciprocal Rank Fusion (RRF).
 */
export const simulateVectorSearch = (query: string): Promise<Paper[]> => {
  return new Promise((resolve, reject) => {
    if (!query) {
      resolve([]);
      return;
    }

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

          // Recency boost applies to both mildly
          if (paper.year > 2020) {
            lexicalScore += 5;
            semanticScore += 5;
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
