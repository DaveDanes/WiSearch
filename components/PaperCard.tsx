import React from 'react';
import { Paper } from '../types';

interface PaperCardProps {
  paper: Paper;
  rank: number;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, rank }) => {
  const score = paper.relevanceScore || 0;
  
  return (
    <div 
      className="group relative glass-card rounded-3xl p-8 hover:-translate-y-2 hover:border-orange-500/30 transition-all duration-500 ease-out opacity-0 animate-slide-up"
      style={{ animationDelay: `${(rank - 1) * 100}ms` }}
    >
      {/* Hover Gradient Bloom */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative flex flex-col h-full z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-orange-400 uppercase tracking-wide border border-white/10 group-hover:bg-orange-500/10 transition-colors">
              {paper.domain}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-zinc-400 border border-white/10">
              {paper.year}
            </span>
          </div>
          
          {/* Circular Score Indicator */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-zinc-800" />
              <circle 
                cx="20" cy="20" r="18" 
                stroke="currentColor" strokeWidth="3" fill="transparent" 
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * score) / 100}
                className="text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">{Math.round(score)}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 flex-grow">
          <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-orange-400 transition-colors">
            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
              <span className="absolute inset-0"></span>
              {paper.title}
            </a>
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 group-hover:text-zinc-300 transition-colors">
            {paper.abstract}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-white/5">
              {paper.authors.charAt(0)}
            </div>
            <span className="text-xs font-medium text-zinc-500 truncate max-w-[150px]">
              {paper.authors}
            </span>
          </div>
          
          <div className="flex items-center text-xs font-bold text-orange-400 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-orange-500/50">
            Read Paper
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;