import React, { useState, useEffect } from 'react';
import { Paper, SearchState } from './types';
import { simulateVectorSearch, validateDataset } from './utils/searchLogic';
import SearchBar from './components/SearchBar';
import PaperCard from './components/PaperCard';
import IntroAnimation from './components/IntroAnimation';
import AboutUs from './components/AboutUs';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>(SearchState.IDLE);
  const [results, setResults] = useState<Paper[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [progress, setProgress] = useState(0);
  const [systemError, setSystemError] = useState<string | null>(null);

  useEffect(() => {
    const initSystem = async () => {
      try {
        const validation = validateDataset();
        if (!validation.isValid) throw new Error(validation.error || "Dataset validation failed");
      } catch (err: any) {
        setSystemError(err.message);
      }
    };
    initSystem();
  }, []);

  const handleSearch = async (query: string) => {
    if (systemError) return;
    setLastQuery(query);
    setSearchState(SearchState.SEARCHING);
    setResults([]);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 95 : prev + Math.random() * 10));
    }, 100);

    try {
      const searchResults = await simulateVectorSearch(query);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResults(searchResults);
        setSearchState(searchResults.length > 0 ? SearchState.RESULTS : SearchState.NO_RESULTS);
      }, 400);
    } catch (error) {
      clearInterval(interval);
      setSearchState(SearchState.ERROR);
    }
  };

  const handleClearSearch = () => {
    setSearchState(SearchState.IDLE);
    setResults([]);
    setLastQuery('');
    setProgress(0);
  };

  if (systemError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-10 rounded-3xl max-w-md text-center shadow-2xl border border-red-900/30">
          <div className="w-12 h-12 bg-red-900/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">System Error</h2>
          <p className="text-zinc-400 mb-6">{systemError}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <motion.div 
          className="min-h-screen pb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Navbar */}
          <nav className="fixed w-full z-50 top-0 left-0 px-6 py-6 pointer-events-none">
            <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
              <div 
                className="flex items-center gap-3 glass px-4 py-2 rounded-full border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setShowAbout(false)}
              >
                <span className="font-semibold text-white tracking-tight text-sm">WiSearch</span>
              </div>
              
              <button 
                onClick={() => setShowAbout(!showAbout)}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-zinc-300 hover:text-white"
              >
                About Us
              </button>
            </div>
          </nav>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {showAbout ? (
              <AboutUs key="about" onBack={() => setShowAbout(false)} />
            ) : (
              <motion.main 
                key="search"
                className="max-w-5xl mx-auto px-6 relative pt-32"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                
                {/* Dynamic Hero Section */}
                <div className={`flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${searchState === SearchState.IDLE ? 'min-h-[60vh]' : 'min-h-[20vh] translate-y-0'}`}>
                  <div className={`text-center transition-all duration-700 ${searchState === SearchState.IDLE ? 'scale-100 opacity-100' : 'scale-90 opacity-0 hidden'}`}>
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                      Research <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                        Reimagined
                      </span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed mb-12 font-light">
                      Semantic intelligence for academic discovery. <br/>
                      Search <span className="text-white font-medium">55 curated papers</span> by concept.
                    </p>
                  </div>

                  <div className={`w-full max-w-2xl transition-all duration-700 ease-out z-20 ${searchState === SearchState.IDLE ? 'transform translate-y-0' : 'transform -translate-y-12'}`}>
                    <SearchBar 
                      onSearch={handleSearch} 
                      onClear={handleClearSearch}
                      isSearching={searchState === SearchState.SEARCHING} 
                      progress={progress}
                      hasResults={searchState === SearchState.RESULTS || searchState === SearchState.NO_RESULTS}
                    />
                  </div>
                </div>

                {/* Results Area */}
                <div className="relative min-h-[400px]">
                  {searchState === SearchState.NO_RESULTS && (
                    <div className="text-center py-24 animate-fade-in">
                      <h3 className="text-xl font-medium text-white mb-2">No matches found</h3>
                      <p className="text-zinc-500">Try adjusting your terms or search for broader concepts.</p>
                    </div>
                  )}

                  {searchState === SearchState.RESULTS && (
                    <div className="animate-slide-up">
                      <div className="flex items-center justify-between mb-8 px-2">
                        <div>
                           <h2 className="text-lg font-semibold text-white">Results</h2>
                           <p className="text-sm text-zinc-400">Semantic match for "<span className="text-orange-400">{lastQuery}</span>"</p>
                        </div>
                        <div className="text-xs font-mono text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                          {results.length} papers
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {results.map((paper, index) => (
                          <PaperCard key={paper.id} paper={paper} rank={index + 1} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.main>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
};

export default App;