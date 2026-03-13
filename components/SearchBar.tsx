import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
  progress: number;
  hasResults: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear, isSearching, progress, hasResults }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "Ask about neural networks...",
    "Search for transformers...",
    "Query cloud scalability...",
    "Find papers on BERT..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className={`relative group transition-all duration-500 ease-out transform ${isFocused ? 'scale-105' : 'scale-100'}`}>
      {/* Glow effect behind search bar */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 ${isFocused ? 'opacity-70' : ''}`}></div>
      
      <form onSubmit={handleSubmit} className="relative z-10">
        <div 
          className={`
            relative overflow-hidden rounded-2xl transition-all duration-300
            ${isFocused ? 'bg-zinc-900 shadow-2xl ring-1 ring-orange-500/50' : 'bg-zinc-900/80 backdrop-blur-md border border-white/10'}
          `}
        >
          <div className="flex items-center px-6 py-5">
            <svg 
              className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-orange-500' : 'text-zinc-500'}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              className="w-full bg-transparent border-none focus:ring-0 text-lg text-white placeholder-zinc-600 font-medium px-4"
              placeholder={placeholders[placeholderIndex]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isSearching}
            />
            
            {/* Clear Button */}
            <div className={`
              transition-all duration-300 transform mr-2
              ${(query.trim() || hasResults) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
            `}>
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`
              transition-all duration-300 transform
              ${query.trim() ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
            `}>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-white text-black p-2 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-orange-500/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Neon Progress Line */}
          {isSearching && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 shadow-[0_0_10px_rgba(249,115,22,0.8)] transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;