import React, { useState, useEffect } from 'react';
import {
  Network,
  ArrowRight,
  Code2,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Layers,
  Database,
  Search,
  Sparkles,
  Binary,
  ListOrdered,
  FileCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { fetchArchitecture } from '../services/api';
import type { ArchitectureComponent } from '../types';

export const ArchitecturePage: React.FC = () => {
  const [components, setComponents] = useState<ArchitectureComponent[]>([]);
  const [selectedComp, setSelectedComp] = useState<ArchitectureComponent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArch();
  }, []);

  const loadArch = async () => {
    setLoading(true);
    try {
      const res = await fetchArchitecture();
      setComponents(res);
      if (res.length > 0) {
        setSelectedComp(res[0]);
      }
    } catch (err) {
      console.error('Failed to load architecture:', err);
    } finally {
      setLoading(false);
    }
  };

  const getComponentIcon = (id: string) => {
    switch (id) {
      case 'user_query':
        return Search;
      case 'query_processing':
        return Sparkles;
      case 'doc_collection':
        return Database;
      case 'text_preprocessing':
        return Sparkles;
      case 'inverted_index':
        return Binary;
      case 'tfidf_calculation':
        return Layers;
      case 'similarity_calculation':
        return Cpu;
      case 'ranking_algorithm':
        return ListOrdered;
      case 'search_results':
        return FileCheck;
      default:
        return Network;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-mono">
          <Network className="w-3.5 h-3.5" />
          <span>Complete System Architecture & Information Flow</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Search Engine Architecture
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Interactive anatomical map of the SearchLab AI system. Click on any component to examine its algorithmic function, design rationale, and Python implementation libraries.
        </p>
      </div>

      {/* Interactive Diagram Flow Grid */}
      <div className="p-8 rounded-3xl glass-panel-glow border-cyan-200 dark:border-cyan-500/30 space-y-8 relative overflow-hidden shadow-sm">
        <div className="space-y-8">
          {/* Upper Tier: Document Ingestion Pipeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                Tier A: Document Ingestion & Storage Pipeline
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {components.slice(2, 5).map((comp) => {
                const Icon = getComponentIcon(comp.id);
                const isSelected = selectedComp?.id === comp.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedComp(comp)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-400 dark:border-purple-400 text-purple-900 dark:text-purple-200 shadow-lg shadow-purple-500/10 scale-[1.02]'
                        : 'bg-white/80 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                        Step 0{comp.step_num}
                      </span>
                      <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">{comp.name}</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{comp.what}</p>
                    <div className="mt-3 text-[11px] font-mono text-purple-700 dark:text-purple-300 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <span>{comp.category}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lower Tier: Query Evaluation & Ranking Pipeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                Tier B: Online Query Processing & Vector Space Ranking
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {components.filter((c) => c.step_num !== 3 && c.step_num !== 4 && c.step_num !== 5).map((comp) => {
                const Icon = getComponentIcon(comp.id);
                const isSelected = selectedComp?.id === comp.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedComp(comp)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-400 dark:border-cyan-400 text-cyan-900 dark:text-cyan-200 shadow-md scale-[1.02]'
                        : 'bg-white/80 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:bg-cyan-50/40 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] font-bold text-cyan-700 dark:text-cyan-400">
                          0{comp.step_num}
                        </span>
                        <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">{comp.name}</h5>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      {comp.category}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Component Deep-Dive Inspection Card */}
      {selectedComp && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border-cyan-200 dark:border-cyan-500/30 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 font-mono font-bold text-sm flex items-center justify-center">
                0{selectedComp.step_num}
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedComp.name}
                </h3>
                <span className="text-xs font-mono text-purple-700 dark:text-purple-300">
                  Category: {selectedComp.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
              <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Python: {selectedComp.python_library}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* What it does */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5 font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>What It Does</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {selectedComp.what}
              </p>
            </div>

            {/* Why it is required */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5 font-semibold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why It Is Required</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {selectedComp.why}
              </p>
            </div>

            {/* How it works */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                <span>How It Works Internally</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {selectedComp.how}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
