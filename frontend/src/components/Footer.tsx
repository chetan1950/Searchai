import React from 'react';
import { Database, Sparkles, Terminal, Code2, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200/90 dark:border-cyan-500/15 bg-white/90 dark:bg-slate-950/90 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-8 lg:px-10 mt-20 relative overflow-hidden transition-colors">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-24 bg-indigo-500/5 dark:bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-purple-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-[1580px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center p-[1px] shadow-sm">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Database className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              </div>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base tracking-tight">
              SearchLab AI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            An interactive Natural Language Processing &amp; Information Retrieval laboratory. Designed for CSE academic demonstration.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-indigo-600 dark:text-cyan-400 font-mono font-medium">
            <Terminal className="w-3.5 h-3.5" />
            <span>FastAPI • NLTK • TF-IDF • Cosine</span>
          </div>
        </div>

        {/* Core Labs */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3 font-mono">
            Exploration Labs
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onNavigate('search')}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                Information Retrieval Search
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('live-demo')}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                7-Step Live Search Demonstration
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('nlp')}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                6-Stage NLP Text Playground
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('inverted-index')}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                Inverted Index Structure
              </button>
            </li>
          </ul>
        </div>

        {/* Mathematical Models */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3 font-mono">
            IR Mathematics
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onNavigate('tfidf')}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                TF-IDF Matrix &amp; Heatmaps
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('similarity')}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                Vector Space Cosine Similarity
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('architecture')}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                Search Engine Architecture
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('documents')}
                className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                Document Parsing &amp; Ingestion
              </button>
            </li>
          </ul>
        </div>

        {/* Academic Details */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
            <span>Academic Project</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Final B.Tech Computer Science Engineering practical demonstration.
          </p>
          <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 space-y-1">
            <div className="text-indigo-700 dark:text-cyan-400 font-bold">Course: Information Retrieval (NLP)</div>
            <div className="text-slate-600 dark:text-slate-400">Model: Vector Space Model (VSM)</div>
            <div className="text-purple-700 dark:text-purple-300">Metric: Cosine Similarity [0.0 - 1.0]</div>
          </div>
        </div>
      </div>

      <div className="max-w-[1580px] mx-auto pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
        <div>
          © 2026 SearchLab AI. Built for Computer Science &amp; Engineering research education.
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1 text-indigo-600 dark:text-cyan-400 font-semibold">
            <Code2 className="w-3.5 h-3.5" /> Python 3.15 + FastAPI
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> React 19 + Vite
          </span>
        </div>
      </div>
    </footer>
  );
};
