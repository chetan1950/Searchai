import React, { useState, useEffect } from 'react';
import {
  Binary,
  Search,
  BookOpen,
  Layers,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Hash,
  Eye
} from 'lucide-react';
import { fetchInvertedIndex } from '../services/api';
import type { InvertedIndexResponse, InvertedIndexRow } from '../types';

interface InvertedIndexPageProps {
  onViewDoc?: (docId: string) => void;
}

export const InvertedIndexPage: React.FC<InvertedIndexPageProps> = ({ onViewDoc }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('df');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InvertedIndexResponse | null>(null);
  const [selectedRow, setSelectedRow] = useState<InvertedIndexRow | null>(null);

  useEffect(() => {
    loadIndex();
  }, [searchTerm, sortBy, page]);

  const loadIndex = async () => {
    setLoading(true);
    try {
      const res = await fetchInvertedIndex(searchTerm, sortBy, page, pageSize);
      setData(res);
      if (res.rows.length > 0 && !selectedRow) {
        setSelectedRow(res.rows[0]);
      }
    } catch (err) {
      console.error('Failed to load inverted index:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadIndex();
  };

  const summary = data?.summary || {
    total_documents: 16,
    unique_vocabulary_count: 595,
    total_tokens_indexed: 1530,
    average_document_length: 95.6,
    top_terms_by_df: [],
    top_terms_by_tf: []
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-mono">
          <Binary className="w-3.5 h-3.5" />
          <span>Core Information Retrieval Data Structure</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Inverted Index Lab
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Inspect the dictionary and posting lists that enable sub-millisecond keyword lookup without sequentially scanning document contents.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 rounded-2xl glass-panel border-cyan-200 dark:border-cyan-500/20 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Unique Vocabulary</span>
          <span className="text-xl font-bold text-cyan-700 dark:text-cyan-300 mt-1 block">
            {summary.unique_vocabulary_count}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Stemmed dictionary terms</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border-purple-200 dark:border-purple-500/20 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Indexed Documents</span>
          <span className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-1 block">
            {summary.total_documents}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Total document corpus</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border-blue-200 dark:border-blue-500/20 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Tokens in Postings</span>
          <span className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1 block">
            {summary.total_tokens_indexed}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Total collection tokens</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border-emerald-200 dark:border-emerald-500/20 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Avg Document Length</span>
          <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1 block">
            {summary.average_document_length}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Tokens per document</span>
        </div>
      </div>

      {/* Search & Sort Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search word in dictionary (e.g. 'learn', 'retriev')..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Sort By:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500 text-xs"
          >
            <option value="df">Doc Frequency (DF DESC)</option>
            <option value="tf">Collection Term Freq (TF DESC)</option>
            <option value="alpha">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Table & Selected Posting Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tabular Inverted Index */}
        <div className="lg:col-span-2 rounded-2xl glass-panel border-cyan-200 dark:border-cyan-500/20 overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Term (Key)</th>
                  <th className="p-3">Doc Freq (DF)</th>
                  <th className="p-3">Total TF</th>
                  <th className="p-3">Posting List (Doc IDs)</th>
                  <th className="p-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Querying Inverted Index...
                    </td>
                  </tr>
                ) : data?.rows && data.rows.length > 0 ? (
                  data.rows.map((row: InvertedIndexRow) => {
                    const isSelected = selectedRow?.term === row.term;
                    return (
                      <tr
                        key={row.term}
                        onClick={() => setSelectedRow(row)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 font-medium'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <td className="p-3 font-bold text-cyan-700 dark:text-cyan-400">
                          {row.term}
                        </td>
                        <td className="p-3 text-purple-700 dark:text-purple-300 font-semibold">
                          {row.df}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {row.total_tf}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {row.posting_list.map((docId) => (
                              <span
                                key={docId}
                                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-mono shadow-xs"
                              >
                                {docId}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRow(row);
                            }}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No index terms found matching "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">
              Page {data?.page || 1} of {data?.total_pages || 1} ({data?.total_terms || 0} terms)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!data || page >= data.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Selected Posting Detail Inspector */}
        <div className="rounded-2xl glass-panel-glow border-cyan-200 dark:border-cyan-500/30 p-5 space-y-4 flex flex-col justify-between shadow-sm">
          {selectedRow ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-700 dark:text-cyan-400 tracking-wider font-semibold">
                  Detailed Posting List
                </span>
                <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                  <span>term:</span>
                  <span className="text-cyan-700 dark:text-cyan-300 underline decoration-cyan-500/40">
                    "{selectedRow.term}"
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Document Frequency:</span>
                  <div className="text-sm font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                    {selectedRow.df} docs
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Total Occurrences:</span>
                  <div className="text-sm font-bold text-cyan-700 dark:text-cyan-300 mt-0.5">
                    {selectedRow.total_tf} times
                  </div>
                </div>
              </div>

              {/* Posting items */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 block">
                  Postings per Document:
                </span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {selectedRow.detailed_postings?.map((post) => (
                    <div
                      key={post.doc_id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">
                          {post.doc_id}
                        </span>
                        <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-500/20">
                          TF = {post.tf}
                        </span>
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-medium truncate">
                        {post.doc_title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        Word Positions: [{post.positions?.slice(0, 10).join(', ')}
                        {post.positions && post.positions.length > 10 ? ', ...' : ''}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs font-mono">
              Select any row to inspect its exact posting chain.
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <strong className="text-slate-800 dark:text-slate-300 block">How Inverted Indexes Work:</strong>
            Instead of storing <em>Document → Words</em>, the system inverts the relationship to <em>Word → Documents</em>. When a user queries two words, the search engine computes the posting list intersections in linear $O(L_1 + L_2)$ time.
          </div>
        </div>
      </div>
    </div>
  );
};
