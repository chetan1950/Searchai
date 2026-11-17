import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  CheckCircle2,
  FileCode,
  FileCheck,
  AlertCircle,
  Database,
  Layers,
  Search,
  X
} from 'lucide-react';
import {
  fetchDocuments,
  fetchSingleDocument,
  createCustomDocument,
  uploadDocumentFile,
  deleteDocument,
  resetSampleDocuments
} from '../services/api';
import type { DocumentItem } from '../types';

interface DocumentExplorerProps {
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const DocumentExplorerPage: React.FC<DocumentExplorerProps> = ({ onNotify }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchDocQuery, setSearchDocQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [viewingTfidf, setViewingTfidf] = useState<any[]>([]);

  // Add custom doc form
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Computer Science');
  const [customContent, setCustomContent] = useState('');
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Drag and drop upload
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res = await fetchDocuments();
      setDocuments(res.documents || []);
      setCategories(res.categories || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
      onNotify('error', 'Failed to load documents from backend');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadDocumentFile(file);
      onNotify('success', 'Document Uploaded & Indexed', res.message);
      loadDocs();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'File upload failed';
      onNotify('error', 'Upload Failed', msg);
    } finally {
      setUploading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customContent.trim()) {
      onNotify('error', 'Missing Information', 'Please provide both title and content.');
      return;
    }

    setIsSubmittingDoc(true);
    try {
      const res = await createCustomDocument(customTitle.trim(), customCategory.trim() || 'General', customContent.trim());
      onNotify('success', 'Custom Document Indexed', res.message);
      setShowAddModal(false);
      setCustomTitle('');
      setCustomContent('');
      loadDocs();
    } catch (err: any) {
      let errorMsg = 'Failed to create document';
      if (err.response?.data?.detail) {
        const d = err.response.data.detail;
        if (typeof d === 'string') {
          errorMsg = d;
        } else if (Array.isArray(d)) {
          errorMsg = d.map((item: any) => item.msg || item.message || JSON.stringify(item)).join('; ');
        } else {
          errorMsg = JSON.stringify(d);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      onNotify('error', 'Error Creating Document', errorMsg);
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleFillSample = () => {
    setCustomTitle('Quantum Information Retrieval & Quantum Walks');
    setCustomCategory('Quantum Computing');
    setCustomContent('Quantum Information Retrieval utilizes Hilbert vector spaces, quantum superposition states, and density matrices to model document relevance and user cognitive states. Quantum walk algorithms traverse hyperlinked graphs faster than classical random walks, enabling quadratic speedups in graph indexing and web search ranking.');
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete document "${title}" (${docId})? The inverted index will be rebuilt.`)) {
      return;
    }
    try {
      const res = await deleteDocument(docId);
      onNotify('info', 'Document Removed', res.message);
      loadDocs();
    } catch (err: any) {
      onNotify('error', 'Delete Failed', err.message);
    }
  };

  const handleResetSamples = async () => {
    if (!window.confirm('Reset the database to the 16 original default academic documents?')) {
      return;
    }
    try {
      const res = await resetSampleDocuments();
      onNotify('success', 'Corpus Reset', res.message);
      loadDocs();
    } catch (err: any) {
      onNotify('error', 'Reset Failed', err.message);
    }
  };

  const handleViewDoc = async (docId: string) => {
    try {
      const res = await fetchSingleDocument(docId);
      setViewingDoc(res.document);
      setViewingTfidf(res.top_tfidf_terms || []);
    } catch (err: any) {
      onNotify('error', 'Failed to fetch document', err.message);
    }
  };

  const filteredDocs = documents.filter((d) => {
    const matchesCat = filterCategory === 'all' || d.category === filterCategory;
    const matchesQuery =
      searchDocQuery === '' ||
      d.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      d.doc_id.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchDocQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-cyan-950/70 border border-indigo-200 dark:border-cyan-500/30 text-indigo-700 dark:text-cyan-400 text-xs font-mono mb-2 font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Document Ingestion &amp; Index Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Document Explorer
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Manage the knowledge corpus. Upload PDF, DOCX, or TXT files, or compose custom text documents with automatic indexing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSamples}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span>Reset 16 Samples</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Custom Text</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 text-center relative overflow-hidden ${
          isDragging
            ? 'border-indigo-500 dark:border-cyan-400 bg-indigo-50/50 dark:bg-cyan-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-cyan-500/40 bg-white/70 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/60 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-cyan-950/80 border border-indigo-200 dark:border-cyan-500/40 flex items-center justify-center mx-auto text-indigo-600 dark:text-cyan-400 shadow-md shadow-indigo-500/10">
            {uploading ? (
              <span className="w-6 h-6 border-2 border-indigo-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {uploading ? 'Processing File & Indexing...' : 'Drag & drop research papers or documents'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports <strong>PDF</strong>, <strong>DOCX</strong>, and <strong>TXT</strong> files. Automatically extracts text, stems tokens with NLTK, updates inverted postings, and recalculates TF-IDF.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-indigo-700 dark:text-cyan-300 font-semibold">
            <span>Click to Browse Local Files</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Documents */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl glass-panel border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchDocQuery}
            onChange={(e) => setSearchDocQuery(e.target.value)}
            placeholder="Filter documents by title, ID, content..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-cyan-400 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-cyan-400 shadow-sm"
          >
            <option value="all">All Categories ({documents.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <span className="font-mono text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredDocs.length}</strong> docs
          </span>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-400 font-mono text-xs">
            Loading documents from SQLite...
          </div>
        ) : filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl glass-panel hover:glass-panel-glow border-slate-200/90 dark:border-cyan-500/15 hover:border-indigo-300 dark:hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/30">
                    {doc.doc_id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 border border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 font-semibold">
                      {doc.file_type}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Indexed
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {doc.content}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>{doc.word_count} words</span>
                  <span>{Math.round(doc.file_size / 1024 * 10) / 10} KB</span>
                  <span className="text-purple-600 dark:text-purple-300 font-semibold">{doc.category}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewDoc(doc.doc_id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 dark:bg-slate-900 dark:hover:bg-cyan-950 dark:border-slate-800 dark:hover:border-cyan-500/40 dark:text-slate-300 dark:hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => handleDelete(doc.doc_id, doc.title)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 dark:bg-slate-900 dark:hover:bg-rose-950 dark:border-slate-800 dark:hover:border-rose-500/40 dark:text-slate-400 dark:hover:text-rose-400 transition-colors shadow-sm"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-400 font-mono text-xs">
            No documents matched your filter.
          </div>
        )}
      </div>

      {/* Add Custom Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-xl w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                <span>Create Custom Document</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Quantum Computing Algorithms & Cryptography"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 dark:focus:border-cyan-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g., Quantum Computing"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 dark:focus:border-cyan-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Content Text *
                </label>
                <textarea
                  required
                  rows={6}
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Paste or write document text here. The system will automatically tokenize, remove stopwords, stem words, and compute TF-IDF vectors..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 dark:focus:border-cyan-400 leading-relaxed font-sans"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold transition-colors"
                >
                  ⚡ Auto-fill Sample IR Text
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDoc}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {isSubmittingDoc ? 'Indexing...' : 'Index Document'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Document Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-2xl w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/40 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/30">
                  {viewingDoc.doc_id}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {viewingDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Meta */}
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>Category: <strong className="text-purple-600 dark:text-purple-300 font-bold">{viewingDoc.category}</strong></div>
                <div>Word Count: <strong className="text-indigo-600 dark:text-cyan-300 font-bold">{viewingDoc.word_count}</strong></div>
                <div>Indexed Tokens: <strong className="text-emerald-600 dark:text-emerald-300 font-bold">{viewingDoc.processed_tokens?.length || 0}</strong></div>
              </div>

              {/* Full Content */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 mb-1.5 font-mono">
                  Extracted Raw Text
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 leading-relaxed font-sans select-text">
                  {viewingDoc.content}
                </div>
              </div>

              {/* Top TF-IDF Terms in this doc */}
              {viewingTfidf.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2 font-mono">
                    Top Characteristic TF-IDF Terms for this Document
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingTfidf.map((t: any) => (
                      <span
                        key={t.term}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 text-purple-800 dark:text-purple-200 font-mono text-[11px] flex items-center gap-1.5"
                      >
                        <span className="font-semibold">{t.term}</span>
                        <span className="text-[10px] text-indigo-600 dark:text-cyan-400 font-bold">
                          {t.tfidf}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
