import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Zap,
  Binary,
  Layers,
  Cpu,
  ArrowRight,
  CheckCircle2,
  ListOrdered,
  Search,
  Code
} from 'lucide-react';
import { fetchLiveTrace } from '../services/api';
import type { DemonstrationTraceResponse, DemonstrationStep } from '../types';

interface LiveDemoPageProps {
  initialQuery?: string;
  onNavigateToSearch: (q: string) => void;
}

export const LiveDemoPage: React.FC<LiveDemoPageProps> = ({
  initialQuery = 'neural networks backpropagation',
  onNavigateToSearch
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [traceData, setTraceData] = useState<DemonstrationTraceResponse | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      runTrace(initialQuery);
    }
  }, [initialQuery]);

  // Automated step timer when playing
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= 7) {
            setIsPlaying(false);
            return 7;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const runTrace = async (q?: string) => {
    const targetQ = (q || query).trim();
    if (!targetQ) return;
    setLoading(true);
    setIsPlaying(false);
    try {
      const res = await fetchLiveTrace(targetQ);
      setTraceData(res);
      setActiveStep(1);
    } catch (err) {
      console.error('Failed to run live trace:', err);
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Query Acquisition', icon: Search },
    { num: 2, label: 'NLP Preprocessing', icon: Sparkles },
    { num: 3, label: 'Inverted Index Lookup', icon: Binary },
    { num: 4, label: 'TF-IDF Vectorization', icon: Layers },
    { num: 5, label: 'Cosine Similarity', icon: Cpu },
    { num: 6, label: 'Document Ranking', icon: ListOrdered },
    { num: 7, label: 'Results Generation', icon: CheckCircle2 }
  ];

  const currentStepData = traceData?.steps?.find((s) => s.step === activeStep);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-500/30 text-purple-800 dark:text-purple-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Interactive Algorithmic Execution Stepper</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          7-Step Live Search Demonstration
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Step inside the search engine brain. Inspect actual mathematical transformations and intermediate data at each pipeline phase.
        </p>
      </div>

      {/* Query Selector Bar */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel-glow border-purple-200 dark:border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="w-full sm:flex-1 relative">
          <Search className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query to demonstrate..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => runTrace()}
            disabled={loading}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Calculate Trace</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Animate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 7-Step Navigation Pipeline Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {stepsList.map((step) => {
          const Icon = step.icon;
          const isCurrent = activeStep === step.num;
          const isDone = activeStep > step.num;

          return (
            <button
              key={step.num}
              onClick={() => {
                setIsPlaying(false);
                setActiveStep(step.num);
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-400 dark:border-purple-400 text-purple-900 dark:text-purple-200 shadow-md scale-[1.02]'
                  : isDone
                  ? 'bg-emerald-50 dark:bg-slate-900/80 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold">0{step.num}</span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-semibold leading-tight line-clamp-2">
                {step.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Step Detail Card */}
      {currentStepData ? (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border-cyan-200 dark:border-cyan-500/30 space-y-6 shadow-sm">
          {/* Header of Step */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                  Step {currentStepData.step} of 7
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {currentStepData.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {currentStepData.description}
              </p>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                disabled={activeStep <= 1}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStep((p) => Math.max(1, p - 1));
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
                {activeStep} / 7
              </span>
              <button
                disabled={activeStep >= 7}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStep((p) => Math.min(7, p + 1));
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Content based on Step */}
          <div className="space-y-4">
            {/* STEP 1: Query Acquisition */}
            {activeStep === 1 && (
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  Raw Query Payload
                </h4>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-base text-cyan-800 dark:text-cyan-300">
                  "{currentStepData.data.raw_query}"
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <div>Character Length: <strong className="text-slate-900 dark:text-slate-200">{currentStepData.data.character_length}</strong></div>
                  <div>Captured At: <strong className="text-slate-900 dark:text-slate-200">{currentStepData.data.timestamp}</strong></div>
                </div>
              </div>
            )}

            {/* STEP 2: Linguistic Preprocessing */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-2">
                    Processed Query Tokens (Porter Stemmed)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStepData.data.token_sequence?.map((tok: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40 font-mono text-sm font-semibold"
                      >
                        {tok}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Total Tokens Retained:</span>
                    <span className="ml-2 font-bold text-slate-800 dark:text-slate-200 font-mono">{currentStepData.data.token_count}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Stages Applied:</span>
                    <span className="ml-2 font-bold text-purple-700 dark:text-purple-300">NLTK 6-Stage Pipe</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Inverted Index Lookup */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  Queried the inverted index hash table for each token. Identified candidate documents with matching postings:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(currentStepData.data.queried_terms || {}).map(([term, info]: [string, any]) => (
                    <div key={term} className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300 text-sm">
                          term: "{term}"
                        </span>
                        <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                          DF: {info.df} docs
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                        <span className="text-slate-500 text-[11px]">Postings:</span>
                        {info.matching_docs?.length > 0 ? (
                          info.matching_docs.map((docId: string) => (
                            <span key={docId} className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                              {docId}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">No direct postings</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 text-xs font-mono text-cyan-800 dark:text-cyan-300 flex items-center justify-between">
                  <span>Candidate Documents Identified:</span>
                  <span className="font-bold">{currentStepData.data.candidate_count} documents</span>
                </div>
              </div>
            )}

            {/* STEP 4: TF-IDF Query Vector Generation */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span>Total Vocabulary Dimension (V): <strong className="text-cyan-700 dark:text-cyan-400">{currentStepData.data.vocabulary_dimension}</strong></span>
                  <span>Query Vector Euclidean Norm ||Q||: <strong className="text-purple-700 dark:text-purple-400">{currentStepData.data.query_vector_norm}</strong></span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-2.5">Query Term</th>
                        <th className="p-2.5">Term Frequency (TF)</th>
                        <th className="p-2.5">Inverse Doc Freq (IDF)</th>
                        <th className="p-2.5">TF-IDF Weight (TF × IDF)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-mono">
                      {currentStepData.data.terms_breakdown?.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-2.5 font-bold text-cyan-700 dark:text-cyan-300">{item.term}</td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">{item.tf}</td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">{item.idf}</td>
                          <td className="p-2.5 font-bold text-purple-700 dark:text-purple-400">{item.tfidf}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEP 5: Cosine Similarity Calculation */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-xs font-mono text-purple-800 dark:text-purple-300">
                  Formula: {currentStepData.data.formula_used}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-2.5">Document ID</th>
                        <th className="p-2.5">Document Title</th>
                        <th className="p-2.5">Dot Product (Q · D)</th>
                        <th className="p-2.5">Doc Norm ||D||</th>
                        <th className="p-2.5">Exact Formula</th>
                        <th className="p-2.5">Cosine Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-mono">
                      {currentStepData.data.calculations?.map((calc: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-2.5 font-bold text-cyan-700 dark:text-cyan-400">{calc.doc_id}</td>
                          <td className="p-2.5 text-slate-800 dark:text-slate-200 font-sans max-w-xs truncate">{calc.title}</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">{calc.dot_product}</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">{calc.doc_norm}</td>
                          <td className="p-2.5 text-slate-500 dark:text-slate-400 text-[11px]">{calc.formula}</td>
                          <td className="p-2.5 font-bold text-emerald-700 dark:text-emerald-400">{calc.similarity_score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEP 6: Document Ranking */}
            {activeStep === 6 && (
              <div className="space-y-4">
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  Sorted candidate documents strictly descending by Cosine Similarity coefficient:
                </div>
                <div className="space-y-2">
                  {currentStepData.data.top_ranked?.map((item: any) => (
                    <div
                      key={item.doc_id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 font-mono font-bold text-xs flex items-center justify-center">
                          #{item.rank}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</div>
                          <div className="text-[11px] font-mono text-slate-500">ID: {item.doc_id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-cyan-700 dark:text-cyan-400">{item.percentage}</div>
                        <div className="text-[10px] font-mono text-slate-500">Score: {item.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: Displaying Results */}
            {activeStep === 7 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>Execution Complete: {currentStepData.data.total_results} relevant hits</span>
                  <span>Latency: {currentStepData.data.execution_time_ms} ms</span>
                </div>

                <div className="space-y-2">
                  {currentStepData.data.results_preview?.map((res: any) => (
                    <div
                      key={res.doc_id}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{res.title}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {res.matched_terms?.map((t: string) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-[10px] font-mono border border-cyan-200 dark:border-cyan-500/20">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold text-cyan-700 dark:text-cyan-400">
                        {res.similarity_percentage}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigateToSearch(query)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <span>View in Full Search Engine Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 font-mono text-sm">
          Click "Calculate Trace" or "Animate" to inspect the live execution steps.
        </div>
      )}
    </div>
  );
};
