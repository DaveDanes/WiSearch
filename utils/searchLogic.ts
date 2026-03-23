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
 * SIMULATION OF SEMANTIC SEARCH
 * Upgraded to simulate true vector embeddings by mapping natural language 
 * questions and concepts to underlying domains and related terms.
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
        
        // 1. Semantic Concept Mapping (Simulating Vector Proximity)
        // If the query contains these concepts/questions, we expand the search terms
        // to simulate how an embedding model understands "meaning".
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

        // Combine original words (ignoring stop words) with semantic expansions
        const stopWords = ["what", "is", "the", "how", "do", "does", "a", "to", "in", "for", "of", "on", "and", "with"];
        const originalTerms = lowerQuery.split(/\s+/).filter(t => !stopWords.includes(t) && t.length > 1);
        const allSearchTerms = [...new Set([...originalTerms, ...semanticExpansions])];

        const scoredPapers = papers.map(paper => {
          let score = 0;
          const lowerTitle = paper.title.toLowerCase();
          const lowerAbstract = paper.abstract.toLowerCase();
          const lowerDomain = paper.domain.toLowerCase();

          // 1. Exact phrase match (Highest relevance)
          if (lowerTitle.includes(lowerQuery)) score += 100;
          if (lowerAbstract.includes(lowerQuery)) score += 60;

          // 2. Semantic & Term matching
          allSearchTerms.forEach(term => {
            // If it's an expanded semantic term, give it a "semantic boost"
            const isSemanticTerm = semanticExpansions.includes(term);
            const titleBoost = isSemanticTerm ? 15 : 20;
            const abstractBoost = isSemanticTerm ? 10 : 10;
            const domainBoost = isSemanticTerm ? 25 : 15;

            if (lowerTitle.includes(term)) score += titleBoost;
            if (lowerAbstract.includes(term)) score += abstractBoost;
            if (lowerDomain.includes(term)) score += domainBoost;
          });

          // 3. Recency boost (newer papers get a slight edge)
          if (paper.year > 2020) score += 5;

          return { ...paper, relevanceScore: score };
        });

        // Filter and sort
        const results = scoredPapers
          .filter(p => p.relevanceScore > 10) // Threshold to ensure quality
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 6);

        resolve(results);
      } catch (error) {
        reject(new Error("Failed to process embeddings."));
      }
    }, 1200);
  });
};
