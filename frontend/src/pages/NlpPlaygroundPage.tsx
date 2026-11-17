import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowDown,
  Layers,
  Code2,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Info,
  Type,
  Scissors,
  Filter,
  Minimize2,
  Hash
} from 'lucide-react';
import { runPreprocess } from '../services/api';
import type { PreprocessingResponse, PreprocessingStage } from '../types';

export const NlpPlaygroundPage: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Information Retrieval Systems help users find relevant information in large collections.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PreprocessingResponse | null>(null);

  useEffect(() => {
    executePipeline(inputText);
  }, []);

  const executePipeline = async (textToRun: string) => {
    setLoading(true);
    try {
      const res = await runPreprocess(textToRun);
      setResult(res);
    } catch (err) {
      console.error('NLP pipeline execution failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleSnippets = [
    'Information Retrieval Systems help users find relevant information in large collections.',
    'Machine learning algorithms learn patterns and statistical relationships from training datasets.',
    'Deep neural networks propagate tensors through activation functions using backpropagation optimization.',
    'The quick brown fox jumps over the lazy dogs, while search engines index billions of web documents.'
  ];

  const stageIcons: Record<number, any> = {
    1: Type,
    2: Minimize2,
    3: Hash,
    4: Scissors,
    5: Filter,
    6: Sparkles
  };

  const stageBorders: Record<number, string> = {
    1: 'border-slate-200 dark:border-slate-800',
    2: 'border-cyan-200 dark:border-cyan-500/30',
    3: 'border-blue-200 dark:border-blue-500/30',
    4: 'border-indigo-200 dark:border-indigo-500/30',
    5: 'border-purple-200 dark:border-purple-500/30',
    6: 'border-fuchsia-200 dark:border-fuchsia-500/30'
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Text Preprocessing Laboratory</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          NLP Preprocessing Playground
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Observe the 6 sequential stages of text normalization used by search engine indexers. Enter custom sentences and track morphological transformations.
        </p>
      </div>

      {/* Input Text Box Card */}
      <div className="p-6 rounded-3xl glass-panel-glow border-cyan-200 dark:border-cyan-500/30 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-2">
            Enter Sentence for NLP Analysis
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter any text to observe the 6-stage NLP pipeline..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 leading-relaxed font-sans transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Preset sentences:</span>
            {sampleSnippets.map((snippet, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(snippet);
                  executePipeline(snippet);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 text-[11px] transition-colors truncate max-w-xs"
              >
                Snippet {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => executePipeline(inputText)}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute 6 Stages</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pipeline Summary Bar */}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono shadow-sm">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Initial Words:</span>
            <div className="text-base font-bold text-slate-900 dark:text-slate-200 mt-0.5">
              {result.summary.initial_words}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Clean Tokens:</span>
            <div className="text-base font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
              {result.summary.final_tokens}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Unique Stems:</span>
            <div className="text-base font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              {result.summary.unique_stems}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Noise Reduction:</span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {result.summary.noise_reduction_pct}%
            </div>
          </div>
        </div>
      )}

      {/* 6 Stage Visual Cards */}
      <div className="space-y-5">
        {result?.stages?.map((stage: PreprocessingStage, index: number) => {
          const Icon = stageIcons[stage.stage_number] || Sparkles;
          const isLast = index === result.stages.length - 1;

          return (
            <React.Fragment key={stage.stage_number}>
              <div
                className={`p-6 rounded-3xl glass-panel ${stageBorders[stage.stage_number]} space-y-4 transition-all duration-300 hover:shadow-xl`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-800 dark:text-cyan-400 font-mono font-bold text-xs">
                      0{stage.stage_number}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>{stage.name}</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {stage.explanation}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                    Stage {stage.stage_number} Output
                  </span>
                </div>

                {/* Stage Output Display */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Transformation Output
                  </h4>
                  {stage.data_type === 'string' ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-mono leading-relaxed select-text">
                      "{stage.output}"
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                      {(stage.output as string[]).map((token: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-cyan-700 dark:text-cyan-300 font-mono text-xs font-semibold shadow-sm"
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Extra Insights: Removed items or Stemming Transformations */}
                {stage.removed_items && stage.removed_items.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 space-y-1.5 text-xs">
                    <span className="text-rose-700 dark:text-rose-300 font-mono font-bold flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5" />
                      Filtered Items ({stage.removed_items.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.removed_items.map((r, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 font-mono text-[11px]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {stage.transformations && stage.transformations.length > 0 && (
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 space-y-1.5 text-xs">
                    <span className="text-purple-700 dark:text-purple-300 font-mono font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Porter Affix Morphological Reductions:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {stage.transformations.map((tr, trIdx) => (
                        <span
                          key={trIdx}
                          className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 font-mono text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="line-through text-slate-400 dark:text-slate-500">{tr.original}</span>
                          <span className="text-purple-600 dark:text-purple-400">→</span>
                          <span className="font-bold text-cyan-700 dark:text-cyan-300">{tr.stemmed}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Educational Insight footer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] font-sans">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80">
                    <strong className="text-cyan-700 dark:text-cyan-400 block mb-0.5">Why this stage is required:</strong>
                    <span className="text-slate-600 dark:text-slate-400">{stage.why}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80">
                    <strong className="text-purple-700 dark:text-purple-400 block mb-0.5">System impact on Search:</strong>
                    <span className="text-slate-600 dark:text-slate-400">{stage.impact}</span>
                  </div>
                </div>
              </div>

              {!isLast && (
                <div className="flex justify-center my-1 text-slate-400 dark:text-slate-600">
                  <ArrowDown className="w-5 h-5 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
