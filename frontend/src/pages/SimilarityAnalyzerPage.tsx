import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Search,
  Calculator,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { runSimilarityAnalysis } from '../services/api';
import type { SimilarityResponse, SimilarityComparison } from '../types';

interface SimilarityAnalyzerPageProps {
  onViewDoc?: (docId: string) => void;
}

export const SimilarityAnalyzerPage: React.FC<SimilarityAnalyzerPageProps> = ({ onViewDoc }) => {
  const [query, setQuery] = useState('natural language processing transformers');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SimilarityResponse | null>(null);

  useEffect(() => {
    executeAnalysis('natural language processing transformers');
  }, []);

  const executeAnalysis = async (qToAnalyze: string) => {
    const q = qToAnalyze.trim();
    if (!q) return;
    setLoading(true);
    try {
      const res = await runSimilarityAnalysis(q, 5);
      setData(res);
    } catch (err) {
      console.error('Cosine similarity analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data?.top_comparisons?.map((c) => ({
    name: `${c.doc_id}: ${c.title.slice(0, 22)}...`,
    score: c.similarity_score,
    percentage: c.similarity_percentage,
    doc_id: c.doc_id
  })) || [];

  const BAR_COLORS = ['#0891b2', '#2563eb', '#7c3aed', '#db2777', '#059669'];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>Vector Space Model (VSM) Geometric Comparison</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Cosine Similarity Analyzer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Analyze how queries and documents are mapped to geometric vectors and compared using the cosine of the angle between them in high-dimensional space.
        </p>
      </div>

      {/* Formula Explanation Banner */}
      <div className="p-6 rounded-3xl glass-panel-glow border-purple-200 dark:border-purple-500/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-sm">
        <div className="md:col-span-2 space-y-2">
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-wider font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Mathematical Definition</span>
          </div>
          <div className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100 p-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-purple-200 dark:border-purple-500/30 text-center sm:text-left">
            Cosine Similarity(A, B) = <span className="text-cyan-700 dark:text-cyan-400">A · B</span> / (<span className="text-purple-700 dark:text-purple-400">||A||</span> × <span className="text-emerald-700 dark:text-emerald-400">||B||</span>)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Where <strong>A · B</strong> is the vector dot product, <strong>||A||</strong> is the Euclidean norm of query vector A, and <strong>||B||</strong> is the norm of document vector B. The resulting value ranges from <strong>0.0</strong> (orthogonal / no overlap) to <strong>1.0</strong> (identical orientation).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono shadow-xs">
          <div className="text-slate-600 dark:text-slate-400 flex justify-between">
            <span>Dot Product:</span>
            <span className="text-cyan-700 dark:text-cyan-300 font-semibold">∑ (A[i] × B[i])</span>
          </div>
          <div className="text-slate-600 dark:text-slate-400 flex justify-between">
            <span>Vector Norm:</span>
            <span className="text-purple-700 dark:text-purple-300 font-semibold">√(∑ A[i]²)</span>
          </div>
          <div className="text-slate-600 dark:text-slate-400 flex justify-between">
            <span>Angle θ:</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">arccos(Sim)</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
            *Length normalized: eliminates bias toward longer documents.
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-2xl glass-panel border-cyan-200 dark:border-cyan-500/20 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter query to compare against document vectors..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500 font-medium"
          />
        </div>

        <button
          onClick={() => executeAnalysis(query)}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Cpu className="w-4 h-4" />
              <span>Compute Cosine Similarities</span>
            </>
          )}
        </button>
      </div>

      {/* Horizontal Comparison Chart */}
      <div className="p-6 rounded-3xl glass-panel border-cyan-200 dark:border-cyan-500/20 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Top-5 Relevance Comparison Chart</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Cosine Score [0.0 - 1.0]
          </span>
        </div>

        <div className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" domain={[0, 1]} stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={160} />
                <Tooltip
                  formatter={(val: any) => [`${val} (${(Number(val) * 100).toFixed(1)}%)`, 'Cosine Sim']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'rgba(6, 182, 212, 0.4)',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              No matching documents exceeded the zero-similarity boundary.
            </div>
          )}
        </div>
      </div>

      {/* Top 5 Detailed Formula Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Top Matching Documents & Mathematical Verification</span>
        </h3>

        <div className="space-y-3">
          {data?.top_comparisons?.map((comp: SimilarityComparison, idx: number) => (
            <div
              key={comp.doc_id}
              className="p-5 rounded-2xl glass-panel hover:glass-panel-glow border-purple-200 dark:border-purple-500/20 hover:border-purple-400/40 transition-all space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-500/40 text-purple-800 dark:text-purple-300 font-mono font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {comp.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="text-cyan-700 dark:text-cyan-400 font-medium">ID: {comp.doc_id}</span>
                      <span>•</span>
                      <span>Category: {comp.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {comp.similarity_percentage}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Score: {comp.similarity_score}
                  </div>
                </div>
              </div>

              {/* Exact Formula Evaluation Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500">Exact Computation: </span>
                  <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{comp.breakdown.cosine_formula}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Dot Product: <strong className="text-slate-800 dark:text-slate-200">{comp.dot_product}</strong></span>
                  <span>||D||: <strong className="text-slate-800 dark:text-slate-200">{comp.doc_norm}</strong></span>
                </div>
              </div>

              {/* Matched stems */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 text-[11px]">Intersected Terms:</span>
                {comp.matched_terms.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-mono text-[11px] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
