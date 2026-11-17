import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  Binary,
  CheckCircle2,
  Sparkles,
  Terminal,
  Award,
  FileText
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-500/40 text-purple-800 dark:text-purple-300 text-xs font-mono">
          <GraduationCap className="w-4 h-4" />
          <span>B.Tech Computer Science Engineering • Final Practical Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Information Retrieval System and Search Engine Using NLP
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Comprehensive academic documentation explaining core algorithmic foundations, system design, and practical experimental findings.
        </p>
      </div>

      {/* Project Overview Card */}
      <div className="p-8 rounded-3xl glass-panel-glow border-cyan-200 dark:border-cyan-500/30 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span>Project Objective & Scope</span>
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          The primary objective of <strong>SearchLab AI</strong> is to design, implement, and demonstrate a fully functional, end-to-end information retrieval system and search engine. Rather than treating search engines as opaque "black boxes", this interactive laboratory visualizes the exact mathematical transformations—from raw text parsing and morphological normalization to high-dimensional Vector Space Model (VSM) projections and cosine similarity ranking.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">BACKEND</span>
            <span className="text-cyan-700 dark:text-cyan-300 font-bold">Python 3.15 + FastAPI</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">NLP & MATH</span>
            <span className="text-purple-700 dark:text-purple-300 font-bold">NLTK + Scikit-Learn + NumPy</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">DATABASE</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-bold">SQLite3 Storage</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">FRONTEND</span>
            <span className="text-blue-700 dark:text-blue-300 font-bold">React 19 + TypeScript</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">TOOLING</span>
            <span className="text-pink-700 dark:text-pink-300 font-bold">Vite + Tailwind CSS</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">PARSERS</span>
            <span className="text-amber-700 dark:text-amber-300 font-bold">PyPDF + python-docx</span>
          </div>
        </div>
      </div>

      {/* Core Technical Concepts Detailed Explanations */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span>Core Concepts in Information Retrieval & NLP</span>
        </h2>

        <div className="space-y-4">
          {/* Concept 1 */}
          <div className="p-6 rounded-2xl glass-panel border-cyan-200 dark:border-cyan-500/20 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-700 dark:text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-500/30">1</span>
              <span>Information Retrieval (IR)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Information Retrieval is the discipline dealing with the representation, storage, organization of, and access to information items. Unlike relational databases that return exact binary matches (e.g. SQL <code className="text-cyan-700 dark:text-cyan-400">WHERE age = 25</code>), IR systems evaluate unstructured natural language texts against vague user queries, returning ranked candidate lists ordered by probabilistic or geometric relevance.
            </p>
          </div>

          {/* Concept 2 */}
          <div className="p-6 rounded-2xl glass-panel border-blue-200 dark:border-blue-500/20 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="font-mono text-xs text-blue-700 dark:text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-500/30">2</span>
              <span>Tokenization & Linguistic Normalization</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tokenization segments continuous character strings into individual lexical tokens. Case-folding (lowercasing) eliminates artificial capitalization variances, ensuring that "Machine", "machine", and "MACHINE" resolve to the identical index key. Removing punctuation prevents non-alphanumeric symbols from artificially fragmenting index terms.
            </p>
          </div>

          {/* Concept 3 */}
          <div className="p-6 rounded-2xl glass-panel border-indigo-200 dark:border-indigo-500/20 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="font-mono text-xs text-indigo-700 dark:text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-500/30">3</span>
              <span>Stopword Removal & Morphological Stemming</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Stopwords are grammatical function words ('the', 'is', 'at', 'which', 'and') that occur abundantly across almost every document and possess virtually zero discriminative power. Removing them reduces index storage by 30–45%. Porter's Stemming algorithm subsequently applies heuristic suffix stripping rules (e.g., 'retrieval' → 'retriev', 'learning' → 'learn') so morphological variants match in search queries.
            </p>
          </div>

          {/* Concept 4 */}
          <div className="p-6 rounded-2xl glass-panel border-purple-200 dark:border-purple-500/20 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="font-mono text-xs text-purple-700 dark:text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-500/30">4</span>
              <span>Inverted Index Data Structure</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The inverted index is the fundamental data structure powering all modern commercial search engines. Rather than sequentially scanning every document on every query, an inverted index maintains an inverted hash dictionary mapping every unique vocabulary term to a <em>posting list</em> containing the document IDs, term frequencies, and word offsets where that term appears. Multi-term search queries evaluate posting list intersections in linear time.
            </p>
          </div>

          {/* Concept 5 */}
          <div className="p-6 rounded-2xl glass-panel border-fuchsia-200 dark:border-fuchsia-500/20 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="font-mono text-xs text-fuchsia-700 dark:text-fuchsia-400 font-bold px-2 py-0.5 rounded bg-fuchsia-100 dark:bg-fuchsia-950 border border-fuchsia-200 dark:border-fuchsia-500/30">5</span>
              <span>TF-IDF (Term Frequency - Inverse Document Frequency)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
              <span>TF-IDF quantifies the statistical significance of a word in a specific document relative to an entire corpus.</span>
              <span className="block font-mono text-[11px] text-cyan-700 dark:text-cyan-300 p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 my-1">
                TF(t, d) = count(t, d) / doc_length(d) &nbsp;|&nbsp; IDF(t) = ln((N + 1) / (DF(t) + 1)) + 1
              </span>
              <span>Multiplying both yields a weight that rewards frequent topical terms while suppressing ubiquitous vocabulary.</span>
            </p>
          </div>

          {/* Concept 6 */}
          <div className="p-6 rounded-2xl glass-panel border-emerald-200 dark:border-emerald-500/20 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/30">6</span>
              <span>Vector Space Model &amp; Cosine Similarity</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In Gerard Salton's Vector Space Model, documents and user queries are modeled as continuous vectors in a vocabulary coordinate space. The relevance between query vector Q and document vector D is calculated using the Cosine of the angle between them:
              <br />
              <code className="text-emerald-700 dark:text-emerald-300 font-mono block p-2 mt-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                Cosine Similarity(Q, D) = (Q · D) / (||Q|| × ||D||)
              </code>
              Because the dot product is divided by the product of Euclidean lengths, Cosine Similarity is length-normalized, preventing long documents with higher raw word counts from dominating the top rankings.
            </p>
          </div>
        </div>
      </div>

      {/* Practical Conclusion */}
      <div className="p-8 rounded-3xl glass-panel-glow border-purple-200 dark:border-purple-500/30 space-y-3 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Practical Conclusion</span>
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Through the development of <strong>SearchLab AI</strong>, we have verified that combining NLTK-driven morphological preprocessing with an Inverted Index and the Vector Space Model yields high-precision, sub-millisecond document retrieval across diverse technical domains.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          The modular decoupled architecture demonstrated here—pairing a Python FastAPI computational engine with a responsive, glassmorphic React 19 interface—successfully bridges foundational computer science theory with modern full-stack web engineering standards.
        </p>
      </div>
    </div>
  );
};
