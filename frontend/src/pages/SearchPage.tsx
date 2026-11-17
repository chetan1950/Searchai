import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Hash,
  Play
} from 'lucide-react';
import { executeSearch, fetchSearchSuggestions, fetchSearchHistory } from '../services/api';
import type { SearchResponse, SearchResultItem, SearchHistoryItem } from '../types';

interface SearchPageProps {
  onNavigateToDemo: (query: string) => void;
  onViewDocument?: (docId: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onNavigateToDemo,
  onViewDocument
}) => {
  const [query, setQuery] = useState('information retrieval vector space');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minScore, setMinScore] = useState(0.0);
  const [sortBy, setSortBy] = useState('relevance');

  const [loading, setLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  // Filters drawer toggle
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initial default search
    handleSearch('information retrieval vector space');
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const h = await fetchSearchHistory();
      setHistory(h);
    } catch (err) {
      console.error('Failed to load search history:', err);
    }
  };

  const handleQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 1) {
      try {
        const res = await fetchSearchSuggestions(val);
        setSuggestions(res.term_suggestions || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : query).trim();
    if (!q) return;

    setShowSuggestions(false);
    setLoading(true);
    try {
      const res = await executeSearch(q, categoryFilter, minScore, sortBy);
      setSearchResponse(res);
      loadHistory();
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (s: string) => {
    setQuery(s);
    setShowSuggestions(false);
    handleSearch(s);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-cyan-950/70 border border-indigo-200 dark:border-cyan-500/30 text-indigo-700 dark:text-cyan-400 text-xs font-mono font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Real-time TF-IDF &amp; Cosine Similarity Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Explore Search Engine
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Experience vector space information retrieval. Enter multi-word queries to retrieve matching documents with mathematical scoring.
        </p>
      </div>

      {/* Main Search Bar Card */}
      <div className="relative glass-panel-glow rounded-3xl p-4 sm:p-6 border-indigo-200/60 dark:border-cyan-500/30 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center"
        >
          <div className="absolute left-4 pointer-events-none text-indigo-500 dark:text-cyan-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            placeholder="Search academic topics (e.g., 'deep learning backpropagation', 'pagerank', 'inverted index')..."
            className="w-full pl-12 pr-32 py-4 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 text-base outline-none transition-all duration-200 shadow-sm"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                showFilters || categoryFilter !== 'all' || minScore > 0
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/50'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
              title="Search Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionBoxRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-cyan-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-4 py-2 text-[11px] font-mono text-indigo-600 dark:text-cyan-400 bg-slate-50 dark:bg-slate-950/60 uppercase tracking-wider flex items-center justify-between font-bold">
                <span>Vocabulary Suggestions (Inverted Index)</span>
                <span>Press Enter to Search</span>
              </div>
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(s)}
                  className="px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-cyan-950/50 hover:text-indigo-700 dark:hover:text-cyan-300 text-slate-800 dark:text-slate-200 text-sm cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">stemmed term</span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category Filter
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-cyan-400"
              >
                <option value="all">All Academic Categories</option>
                <option value="Information Retrieval">Information Retrieval</option>
                <option value="Natural Language Processing">Natural Language Processing</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Deep Learning">Deep Learning</option>
                <option value="Search Engines">Search Engines</option>
                <option value="Web Crawling">Web Crawling</option>
                <option value="Web Indexing">Web Indexing</option>
                <option value="PageRank">PageRank</option>
                <option value="Data Science">Data Science</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="Neural Networks">Neural Networks</option>
                <option value="Database Systems">Database Systems</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
                <span>Min Similarity Score</span>
                <span className="font-mono text-indigo-600 dark:text-cyan-400 font-bold">{(minScore * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={minScore}
                onChange={(e) => setMinScore(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sort Results By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-cyan-400"
              >
                <option value="relevance">Relevance (Cosine Sim DESC)</option>
                <option value="title">Document Title (A-Z)</option>
                <option value="words">Word Count (DESC)</option>
              </select>
            </div>
          </div>
        )}

        {/* Quick query tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-indigo-500 dark:text-cyan-400" />
            Try queries:
          </span>
          {[
            'inverted index information retrieval',
            'pagerank link graph web',
            'deep neural networks backpropagation',
            'convolutional neural networks computer vision',
            'relational database b-tree indexing'
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                handleSearch(tag);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-900 dark:hover:bg-cyan-950/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors font-medium text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header: Stats & Demonstration Mode Link */}
      {searchResponse && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                Found <strong className="text-indigo-600 dark:text-cyan-400 font-bold">{searchResponse.total_results}</strong>{' '}
                relevant document{searchResponse.total_results === 1 ? '' : 's'}
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
              <span>{searchResponse.execution_time_ms} ms</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateToDemo(query)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/70 border border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Launch 7-Step Live Animation for this Query</span>
          </button>
        </div>
      )}

      {/* Search Results List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-10 h-10 border-2 border-indigo-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-mono text-indigo-600 dark:text-cyan-400">Computing TF-IDF vectors &amp; cosine angles...</p>
          </div>
        ) : searchResponse && searchResponse.results.length > 0 ? (
          searchResponse.results.map((item: SearchResultItem) => (
            <div
              key={item.doc_id}
              className="p-5 sm:p-6 rounded-2xl glass-panel hover:glass-panel-glow border-slate-200/90 dark:border-cyan-500/20 hover:border-indigo-300 dark:hover:border-cyan-400/40 transition-all duration-300 space-y-3.5"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/30">
                      #{item.rank}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 font-semibold">
                      ID: {item.doc_id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-500/30 font-semibold">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {item.word_count} words
                    </span>
                  </div>

                  <h3
                    onClick={() => onViewDocument && onViewDocument(item.doc_id)}
                    className="text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-cyan-300 cursor-pointer transition-colors"
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Relevance Percentage Badge */}
                <div className="text-right shrink-0">
                  <div className="text-xl font-extrabold font-mono text-indigo-600 dark:text-cyan-400">
                    {item.similarity_percentage}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    Cosine Sim: {item.similarity_score}
                  </div>
                </div>
              </div>

              {/* Relevance Score Bar */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(8, item.similarity_percentage))}%` }}
                  />
                </div>
              </div>

              {/* Content Preview Snippet with highlighted keywords */}
              <p
                className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{ __html: item.snippet }}
              />

              {/* Matched keywords tags */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 text-[11px] font-semibold">Matched Stems:</span>
                  {item.matched_terms.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-500/30 font-mono text-[11px] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Dot Product: {item.dot_product}</span>
                  <span>Doc Norm: {item.doc_norm}</span>
                </div>
              </div>
            </div>
          ))
        ) : searchResponse && searchResponse.total_results === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl glass-panel border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">
                No matching documents found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No indexed documents met the similarity threshold for "{query}". Try searching with terms like "neural", "retrieval", "algorithm", or lower the similarity filter.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setMinScore(0.0);
                  setCategoryFilter('all');
                  handleSearch(query);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/40 text-xs font-semibold transition-colors"
              >
                Reset Filters &amp; Search Again
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Recent Searches Section */}
      {history.length > 0 && (
        <div className="p-5 rounded-2xl glass-panel border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2 font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span>Recent Query Logs (SQLite)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {history.slice(0, 6).map((h) => (
              <div
                key={h.id}
                onClick={() => {
                  setQuery(h.query);
                  handleSearch(h.query);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-cyan-500/30 cursor-pointer transition-colors text-xs space-y-1"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {h.query}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{h.results_count} hits</span>
                  <span>{h.execution_time_ms} ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
