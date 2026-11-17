import React, { useEffect, useState } from 'react';
import {
  Search,
  Sparkles,
  Network,
  BookOpen,
  ArrowRight,
  Database,
  Layers,
  Cpu,
  Clock,
  Zap,
  CheckCircle2,
  Binary,
  HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { fetchDashboard } from '../services/api';
import type { DashboardResponse } from '../types';
import { StatCard } from '../components/StatCard';

interface OverviewPageProps {
  onNavigate: (tab: string) => void;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#14b8a6'];

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.statistics || {
    indexed_documents: 16,
    unique_vocabulary: 595,
    total_tokens_indexed: 1530,
    search_operations: 0,
    avg_search_time_ms: 0.0,
    total_corpus_words: 1650
  };

  const pipelineStages = [
    {
      id: 1,
      title: "Documents Collection",
      subtitle: "Ingestion & Parsing",
      desc: "Raw PDF, DOCX, & TXT documents ingested into the SQLite corpus with metadata extraction.",
      icon: Database,
      color: "from-cyan-500 to-blue-500",
      target: "documents"
    },
    {
      id: 2,
      title: "NLP Preprocessing",
      subtitle: "6-Stage Pipeline",
      desc: "NLTK tokenization, lowercase folding, punctuation removal, stopword filtering, and Porter stemming.",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-500",
      target: "nlp"
    },
    {
      id: 3,
      title: "Inverted Indexing",
      subtitle: "Posting Lists",
      desc: "Vocabulary hashing mapping each root term to its document frequency and positional postings.",
      icon: Binary,
      color: "from-indigo-500 to-purple-500",
      target: "inverted-index"
    },
    {
      id: 4,
      title: "Vector Space Model",
      subtitle: "TF-IDF & Cosine",
      desc: "Computing Term Frequency and Inverse Document Frequency to project queries & docs into geometric vectors.",
      icon: Layers,
      color: "from-purple-500 to-fuchsia-500",
      target: "tfidf"
    },
    {
      id: 5,
      title: "Ranked Retrieval",
      subtitle: "Sorted Results & SERP",
      desc: "Normalized Cosine Similarity (A·B)/(||A||×||B||) ranking top documents with highlighted snippets.",
      icon: Cpu,
      color: "from-fuchsia-500 to-rose-500",
      target: "search"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden glass-panel-glow border-indigo-200/60 dark:border-cyan-500/25">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-cyan-950/80 border border-indigo-200 dark:border-cyan-500/40 text-indigo-700 dark:text-cyan-300 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span>Interactive NLP &amp; Information Retrieval Laboratory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Understand How Search Engines{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Think.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            An interactive computer science engineering laboratory dissecting modern search engine mechanics: from NLTK text processing and inverted indices to TF-IDF vectorization and cosine similarity document ranking.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('search')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Launch Search Engine</span>
            </button>

            <button
              onClick={() => onNavigate('live-demo')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-50 dark:bg-purple-950/70 hover:bg-purple-100 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-200 font-bold text-sm border border-purple-200 dark:border-purple-500/40 shadow-sm transition-all duration-200"
            >
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>7-Step Live Demo</span>
            </button>

            <button
              onClick={() => onNavigate('nlp')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-cyan-500/40 transition-all duration-200 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>NLP Playground</span>
            </button>

            <button
              onClick={() => onNavigate('architecture')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all duration-200 shadow-sm"
            >
              <Network className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>View Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Animated Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Indexed Documents"
          value={stats.indexed_documents}
          subtitle="Pre-loaded academic corpus"
          icon={BookOpen}
          trend="100% Inverted Indexed"
          glowColor="cyan"
        />
        <StatCard
          title="Unique Vocabulary"
          value={stats.unique_vocabulary}
          subtitle="Stemmed index dictionary"
          icon={Binary}
          trend="Active Vocabulary Keys"
          glowColor="purple"
        />
        <StatCard
          title="Search Operations"
          value={stats.search_operations}
          subtitle="Logged in SQLite DB"
          icon={Search}
          trend="Real-time Tracking"
          glowColor="blue"
        />
        <StatCard
          title="Average Search Time"
          value={`${stats.avg_search_time_ms} ms`}
          subtitle="Sub-millisecond retrieval"
          icon={Clock}
          trend="Vector Dot Product"
          glowColor="emerald"
        />
      </div>

      {/* Visual Pipeline Flow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Information Retrieval Pipeline</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Follow how raw text transforms into ranked search engine results.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-500/20 font-medium">
            End-to-End System
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                onClick={() => onNavigate(stage.target)}
                className="group relative p-4 rounded-2xl glass-panel hover:glass-panel-glow border-slate-200 dark:border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 flex items-center justify-center">
                      0{stage.id}
                    </span>
                    <div className={`p-2 rounded-lg bg-gradient-to-tr ${stage.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 mb-1.5 font-medium">
                    {stage.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-cyan-700 dark:text-cyan-400 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <span>Explore Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="p-6 rounded-2xl glass-panel border-cyan-200 dark:border-cyan-500/20 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Corpus Topic Distribution</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {stats.indexed_documents} Documents
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            {data?.category_distribution && data.category_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.category_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.category_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(6, 182, 212, 0.4)',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Loading topic distribution...</div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {data?.category_distribution?.slice(0, 6).map((c, idx) => (
              <span
                key={c.name}
                className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span>{c.name} ({c.value})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Top Frequent Vocabulary Terms */}
        <div className="p-6 rounded-2xl glass-panel border-purple-200 dark:border-purple-500/20 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Binary className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Top Collection Frequency (TF)</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Stemmed NLTK Vocabulary
            </span>
          </div>

          <div className="h-64">
            {data?.top_frequent_terms && data.top_frequent_terms.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.top_frequent_terms} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="term" stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(168, 85, 247, 0.4)',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="total_tf" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Total TF" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading vocabulary statistics...
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Terms with higher collection frequency and spread across documents form the backbone of the Inverted Index posting tree.
          </p>
        </div>
      </div>
    </div>
  );
};
