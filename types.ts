export interface Paper {
  id: number;
  title: string;
  abstract: string;
  authors: string;
  year: number;
  domain: string;
  url: string;
  relevanceScore?: number; // Added for frontend simulation
}

export enum SearchState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  RESULTS = 'RESULTS',
  NO_RESULTS = 'NO_RESULTS',
  INVALID_QUERY = 'INVALID_QUERY',
  ERROR = 'ERROR'
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
