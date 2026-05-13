import React from 'react';
import { Paper } from '../types';

interface PaperCardProps {
  paper: Paper;
  rank: number;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, rank }) => {
  const score = paper.relevanceScore || 0;
  // Normalize score between 0 and 100 for the circle stroke
  const normalizedScore = Math.min(score, 100);
  // Optional: Convert RRF score to a percentage-like display value
  const displayScore = score > 100 ? 99 : Math.round(score);
  
  return (
    <div 
      className="group relative bg-[#FFFFFF] dark:bg-[#292524] rounded-2xl p-8 hover:-translate-y-1 hover:shadow-2xl border border-stone-200 dark:border-stone-700/50 transition-all duration-500 ease-out opacity-0 animate-slide-up"
      style={{ animationDelay: `${(rank - 1) * 100}ms` }}
    >
      <div className="relative flex flex-col h-full z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-[#9A3412] dark:text-[#D6D3D1] tracking-widest uppercase border border-stone-200 dark:border-stone-700">
              {paper.domain}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 tracking-widest uppercase border border-stone-200 dark:border-stone-700">
              {paper.year}
            </span>
          </div>
          
          {/* Subtle Score Badge */}
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-stone-400 dark:text-stone-500">{displayScore}% match</span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 flex-grow">
          <h3 className="text-2xl font-serif text-[#1C1917] dark:text-[#F7F5F0] mb-4 leading-snug group-hover:text-[#9A3412] dark:group-hover:text-[#D6D3D1] transition-colors">
            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
              <span className="absolute inset-0"></span>
              {paper.title}
            </a>
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed line-clamp-3">
            {paper.abstract}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-stone-100 dark:border-stone-800 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[10px] font-serif text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              {paper.authors.charAt(0)}
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[150px]">
              {paper.authors}
            </span>
          </div>
          
          <div className="flex items-center text-xs font-medium tracking-wide text-[#9A3412] dark:text-[#D6D3D1] opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Read Paper
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;