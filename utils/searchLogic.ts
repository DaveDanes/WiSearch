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
 */
export const simulateVectorSearch = (query: string): Promise<Paper[]> => {
  return new Promise((resolve, reject) => {
    // Simulate initialization check
    if (!query) {
      resolve([]);
      return;
    }

    // Simulate network latency and processing
    setTimeout(() => {
      try {
        const lowerQuery = query.toLowerCase().trim();
        const terms = lowerQuery.split(/\s+/).filter(t => t.length > 2);

        const scoredPapers = papers.map(paper => {
          let score = 0;
          const lowerTitle = paper.title.toLowerCase();
          const lowerAbstract = paper.abstract.toLowerCase();
          const lowerDomain = paper.domain.toLowerCase();

          // 1. Exact phrase match (High relevance signal)
          if (lowerTitle.includes(lowerQuery)) score += 50;
          if (lowerAbstract.includes(lowerQuery)) score += 30;

          // 2. Term matching (TF-ish)
          terms.forEach(term => {
            if (lowerTitle.includes(term)) score += 10;
            if (lowerAbstract.includes(term)) score += 5;
            if (lowerDomain.includes(term)) score += 15; // Domain boost
          });

          // 3. Recency boost
          if (paper.year > 2020) score += 2;

          return { ...paper, relevanceScore: score };
        });

        const results = scoredPapers
          .filter(p => p.relevanceScore > 5)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 6);

        resolve(results);
      } catch (error) {
        reject(new Error("Failed to process embeddings."));
      }
    }, 1500); // Increased delay to show off the progress bar
  });
};
