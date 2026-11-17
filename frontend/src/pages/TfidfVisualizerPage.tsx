import React, { useState, useEffect } from 'react';
import {
  Layers,
  HelpCircle,
  FileText,
  Binary,
  BarChart2,
  Table2,
  ArrowRight,
  Info,
  CheckCircle2,
  Hash
} from 'lucide-react';
import { fetchTfidfData, fetchDocuments } from '../services/api';
import type { TfidfResponse, DocumentItem } from '../types';

export const TfidfVisualizerPage: React.FC = () => {
  const [data, setData] = useState<TfidfResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('D1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      loadTfidf(selectedDocId);
    }
  }, [selectedDocId]);

  const loadDocs = async () => {
    try {
      const res = await fetchDocuments();
      setDocuments(res.documents || []);
      if (res.documents && res.documents.length > 0) {
        setSelectedDocId(res.documents[0].doc_id);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const loadTfidf = async (docId: string) => {
    setLoading(true);
    try {
      const res = await fetchTfidfData(docId, 25, 12, 8);
      setData(res);
    } catch (err) {
      console.error('Failed to load TF-IDF data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate background intensity for heatmap cells
  const getCellBg = (val: number) => {
    if (val === 0) return 'bg-slate-100 dark:bg-slate-950/60 text-slate-400 dark:text-slate-600';
    if (val < 0.03) return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300';
    if (val < 0.08) return 'bg-cyan-200 dark:bg-cyan-900/60 text-cyan-900 dark:text-cyan-200 font-medium';
    if (val < 0.15) return 'bg-cyan-600 dark:bg-cyan-700/80 text-white font-bold';
    return 'bg-purple-600 dark:bg-purple-600/80 text-white font-bold shadow-xs';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>Vector Space Term Weighting Visualizer</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          TF-IDF Mathematical Visualizer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Explore how Term Frequency (TF) and Inverse Document Frequency (IDF) combine to assign statistical importance weights to vocabulary words.
        </p>
      </div>

      {/* Simple Educational Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border-cyan-200 dark:border-cyan-500/20 space-y-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 font-mono font-bold text-xs flex items-center justify-center">
              TF
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Term Frequency (TF)
            </h4>
          </div>
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-cyan-700 dark:text-cyan-300">
            TF(t, d) = count(t, d) / len(d)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Measures how often a word occurs in a document. Normalized by document length to prevent long files from having an unfair advantage.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border-purple-200 dark:border-purple-500/20 space-y-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-500/40 text-purple-800 dark:text-purple-300 font-mono font-bold text-xs flex items-center justify-center">
              IDF
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Inverse Doc Frequency (IDF)
            </h4>
          </div>
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-purple-700 dark:text-purple-300">
            IDF(t) = ln((N+1)/(DF+1)) + 1
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Measures how informative a word is across the whole corpus. Common words ('system', 'data') receive low IDF; rare domain words receive high IDF.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border-blue-200 dark:border-blue-500/20 space-y-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-500/40 text-blue-800 dark:text-blue-300 font-mono font-bold text-xs flex items-center justify-center">
              W
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Composite TF-IDF Weight
            </h4>
          </div>
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-blue-700 dark:text-blue-300">
            TF-IDF(t, d) = TF(t, d) × IDF(t)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Words that appear frequently within a document but rarely across the rest of the collection receive the highest vector weights.
          </p>
        </div>
      </div>

      {/* Interactive Document Selector & Highest TF-IDF Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Document Picker */}
        <div className="p-5 rounded-2xl glass-panel border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Select Document</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {documents.length} available
            </span>
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {documents.map((doc) => {
              const isSelected = selectedDocId === doc.doc_id;
              return (
                <button
                  key={doc.doc_id}
                  onClick={() => setSelectedDocId(doc.doc_id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-400 text-cyan-900 dark:text-cyan-200 shadow-xs'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-cyan-800 dark:text-cyan-300 border border-slate-200 dark:border-slate-800">
                      {doc.doc_id}
                    </span>
                    <span className="truncate font-medium">{doc.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                    {doc.word_count}w
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Highest TF-IDF Terms in this Document */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel-glow border-cyan-200 dark:border-cyan-500/30 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-700 dark:text-cyan-400 tracking-wider font-semibold">
                Document Top Informative Terms
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="font-mono text-cyan-700 dark:text-cyan-300">[{data?.selected_doc.doc_id}]</span>
                <span>{data?.selected_doc.title}</span>
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>{data?.selected_doc.unique_stems} unique stems</span>
            </div>
          </div>

          {/* Top terms table */}
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase text-[10px] sticky top-0 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-2.5">Term (Stem)</th>
                  <th className="p-2.5">Raw Count</th>
                  <th className="p-2.5">Normalized TF</th>
                  <th className="p-2.5">Corpus IDF</th>
                  <th className="p-2.5">TF-IDF Weight</th>
                  <th className="p-2.5">Visual Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {data?.top_terms_for_selected?.map((t) => (
                  <tr key={t.term} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                    <td className="p-2.5 font-bold text-cyan-700 dark:text-cyan-300">{t.term}</td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-400">{t.raw_tf}</td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300">{t.tf}</td>
                    <td className="p-2.5 text-purple-700 dark:text-purple-300 font-semibold">{t.idf}</td>
                    <td className="p-2.5 font-bold text-emerald-700 dark:text-emerald-400">{t.tfidf}</td>
                    <td className="p-2.5">
                      <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(10, t.tfidf * 400))}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Document-Term Matrix Heatmap */}
      <div className="p-6 rounded-3xl glass-panel border-cyan-200 dark:border-cyan-500/20 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Table2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Document-Term Matrix Heatmap</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Interactive 2D matrix comparing high-information terms against sample documents. Darker purple indicates higher TF-IDF saliency.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-700" /> 0.0
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-cyan-200 dark:bg-cyan-900" /> Med
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-purple-600" /> High Weight
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-center border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[11px] border-b border-slate-200 dark:border-slate-800">
                <th className="p-2 text-left font-sans min-w-[140px]">Document</th>
                {data?.matrix_terms?.map((term) => (
                  <th key={term} className="p-2 min-w-[70px] text-cyan-800 dark:text-cyan-400 font-semibold">
                    {term}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {data?.heatmap_data?.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="p-2 text-left font-sans font-medium text-slate-800 dark:text-slate-300 truncate max-w-[150px]">
                    <span className="font-mono text-cyan-700 dark:text-cyan-400 mr-1.5">[{row.doc_id}]</span>
                    {row.title}
                  </td>
                  {data?.matrix_terms?.map((term) => {
                    const val = row[term] || 0.0;
                    return (
                      <td
                        key={term}
                        className={`p-2 transition-colors ${getCellBg(val)}`}
                        title={`Doc: ${row.doc_id}, Term: ${term}, TF-IDF: ${val}`}
                      >
                        {val > 0 ? val.toFixed(3) : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
