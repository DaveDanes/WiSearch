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
    <div className={`relative group transition-all duration-500 ease-out transform ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
      
      <form onSubmit={handleSubmit} className="relative z-10">
        <div 
          className={`
            relative overflow-hidden transition-all duration-300
            ${isFocused ? 'bg-white dark:bg-[#292524] shadow-xl ring-1 ring-stone-900/10 dark:ring-stone-100/10' : 'bg-white/80 dark:bg-[#292524]/80 backdrop-blur-md border border-stone-200 dark:border-stone-700/50'}
          `}
          style={{ borderRadius: '2rem' }}
        >
          <div className="flex items-center px-6 py-5">
            <svg 
              className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-[#9A3412] dark:text-[#D6D3D1]' : 'text-stone-400 dark:text-stone-500'}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              className="w-full bg-transparent border-none focus:ring-0 text-lg text-stone-900 dark:text-[#F7F5F0] placeholder-stone-400 dark:placeholder-stone-500 font-serif italic px-4"
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
                className="p-2 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#F7F5F0] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
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
                className="bg-[#1C1917] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1917] p-2 rounded-full hover:bg-[#9A3412] dark:hover:bg-[#D6D3D1] dark:hover:text-[#1C1917] transition-all shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Progress Line */}
          {isSearching && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div 
                className="h-full bg-[#9A3412] dark:bg-[#D6D3D1] transition-all duration-200 ease-out"
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