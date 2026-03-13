import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Globe, User, GraduationCap, ArrowLeft, Search, Layers, Lightbulb, BookOpen } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <motion.div 
      className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Search</span>
      </button>

      {/* Headline */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
          We built a search engine that <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-600">
            actually understands you.
          </span>
        </h1>
      </div>

      {/* Who We Are */}
      <div className="mb-24 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Who We Are</h2>
        <p className="text-lg text-zinc-400 leading-relaxed">
          We are a team of seven Computer Science students from the B.Tech programme, working together on a problem that quietly frustrates every researcher, student, and knowledge worker — finding the right information, even when you don't know the exact words to search for.
        </p>
        <p className="text-lg text-zinc-400 leading-relaxed mt-4">
          This project is our capstone — our most serious, most ambitious academic work yet. It is supervised by <span className="text-white font-medium">Dr. Meena Chaudhary</span>, whose guidance has helped us think not just as students, but as engineers solving a real problem.
        </p>
      </div>

      {/* What We Built & Why It Exists */}
      <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">What We Built & Why It Exists</h2>
          <p className="text-zinc-400 mb-4 leading-relaxed">
            Search is broken in a very specific way. You type a perfectly reasonable question, and the engine returns nothing useful — not because the answer doesn't exist, but because your words didn't match the document's words exactly. That's the <span className="text-orange-400">vocabulary mismatch problem</span>, and it's been quietly failing people for decades.
          </p>
          <p className="text-zinc-400 mb-4 leading-relaxed">
            We built an <span className="text-white font-medium">Intelligent Semantic Search Engine</span> that solves exactly this.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Instead of hunting for matching words, our system understands the <em>meaning</em> behind your query. You can search for "papers about teaching machines to recognise images" and it will surface research on "deep learning for visual recognition" — because it understands they mean the same thing.
          </p>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <h3 className="text-xl font-bold text-white mb-4">Focus Areas</h3>
           <p className="text-zinc-400 mb-6">
             We focused our system on a curated collection of research papers across:
           </p>
           <ul className="space-y-3">
             {[
               "Artificial Intelligence",
               "Machine Learning",
               "Cloud Computing"
             ].map((item, i) => (
               <li key={i} className="flex items-center gap-3 text-zinc-300">
                 <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                 {item}
               </li>
             ))}
           </ul>
           <p className="text-zinc-500 text-sm mt-6 italic">
             Precisely because academic search is where this problem hurts the most.
           </p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-colors">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">The Problem</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Traditional keyword search treats your query as a bag of words. It doesn't know context, synonyms, or intent. If your phrasing doesn't match the document's phrasing — you get nothing, even when the answer is right there.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Our Solution</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Every research paper is converted into a dense numerical fingerprint — called an <em>embedding</em> — that captures its meaning. When you type a query, we convert that too. Then we find the papers whose meaning is closest to yours.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-teal-500/30 transition-colors">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">The Result</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Search that feels intuitive, because it thinks the way you do. You get the top most relevant research papers, ranked by how closely they match what you actually meant — complete with direct links to the source.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="mb-24">
        <div className="glass-card p-10 rounded-3xl border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-teal-500"></div>
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            We believe that the right information should be findable by anyone — not just by people who happen to use the right jargon. Knowledge shouldn't be locked behind imprecise search. Our mission is to demonstrate that smarter, meaning-aware search is not just possible — it's practical, deployable, and accessible today.
          </p>
        </div>
      </div>

      {/* What We Stand For */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">What We Stand For</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Clarity over complexity</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We built something technically sophisticated, but designed it to feel effortless to use. If a first-year student can search it comfortably, we've done our job.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Honesty about limitations</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We know this system has boundaries. It works on a curated dataset. It isn't perfect. We document its limitations openly, because good engineering means knowing what your system <em>can't</em> do.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">Learning in public</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every architectural decision — why FAISS, why Sentence Transformers, why Streamlit — was made deliberately. We didn't just build it. We understood it.
            </p>
          </div>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">Meet the Team</h2>
        
        {/* Supervisor */}
        <div className="max-w-md mx-auto mb-16">
          <div className="glass-card p-6 rounded-3xl border border-white/10 text-center relative overflow-hidden">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Dr. Meena Chaudhary</h3>
            <p className="text-purple-400 text-sm font-medium mb-4">Project Supervisor</p>
            <p className="text-zinc-400 text-sm">
              Providing expert guidance and academic oversight. Her mentorship ensures the project 
              maintains high standards of research and technical execution.
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: "Abhishek Gusain", roll: "2K23CSUN01062" },
            { name: "Dhruv", roll: "2K23CSUN01080" },
            { name: "Karthik Reddy", roll: "2K23CSUN01087" },
            { name: "Raahi Singh", roll: "2K23CSUN01106" },
            { name: "B.Siva Nandini", roll: "2K23CSUN01136" },
            { name: "Chaitanya Dhawan", roll: "2K23CSUN01139" },
            { name: "Yogeeta", roll: "2K23CSUN01192" }
          ].map((member, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 text-center hover:border-orange-500/30 transition-colors group">
              <div className="w-16 h-16 mx-auto bg-white/5 rounded-full mb-4 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                <User className="w-6 h-6 text-zinc-400 group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
              <p className="text-zinc-500 text-xs font-mono">{member.roll}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future Plans */}
      <div className="mb-24 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">A Note on Where We're Headed</h2>
        <p className="text-zinc-400 leading-relaxed mb-6">
          This project is a starting point, not a finish line. We've already mapped out what comes next — live paper ingestion from ArXiv, hybrid search that combines semantic and keyword signals, and smarter re-ranking of results. The foundation we've built here is designed to grow.
        </p>
        <p className="text-white font-medium text-lg">
          We built this because we wanted to build something that <em>matters</em> — something we'd actually want to use ourselves.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-white/10 pt-12">
        <p className="text-zinc-500 text-sm mb-2">B.Tech Capstone Project · Computer Science & Engineering</p>
        <p className="text-zinc-600 text-xs">Submitted under the supervision of Dr. Meena Chaudhary</p>
      </div>

    </motion.div>
  );
};

export default AboutUs;
