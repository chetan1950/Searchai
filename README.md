# SearchLab AI – Information Retrieval & Search Engine Using NLP

> **Final Practical Project for B.Tech Computer Science Engineering**  
> An interactive educational laboratory and search engine demonstrating the internal mechanics of Natural Language Processing, Inverted Indexing, TF-IDF vectorization, and Cosine Similarity ranking.

---

## 🌟 Project Overview

**SearchLab AI** is a fully functional, end-to-end educational web application designed to teach students, developers, and researchers how modern search engines operate internally. Moving beyond superficial search bars, SearchLab AI exposes the complete mathematical and linguistic pipeline:
1. **Document Ingestion & Text Extraction**: Parsing text from PDF, DOCX, and TXT files.
2. **6-Stage NLP Normalization**: Case folding, Treebank tokenization, punctuation filtering, stopword stripping, and Porter affix stemming.
3. **Inverted Index Construction**: Mapping unique vocabulary stems to document frequencies and positional posting lists.
4. **Vector Space Model (VSM) Weighting**: Calculating Term Frequency (TF), smoothed Inverse Document Frequency (IDF), and composite TF-IDF vectors.
5. **Relevance Ranking & Retrieval**: Computing the geometric Cosine Similarity angle between query and document vectors:
   $$\text{Cosine Similarity}(Q, D) = \frac{\vec{Q} \cdot \vec{D}}{\|\vec{Q}\| \times \|\vec{D}\|}$$
6. **Live Execution Trace**: An interactive 7-step visual animation demonstrating actual backend mathematical calculations step by step.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts |
| **Backend** | Python 3.15, FastAPI, Uvicorn, Pydantic |
| **NLP & Math** | NLTK (Tokenization, Stopwords, PorterStemmer), Scikit-learn, NumPy, Math |
| **Document Parsing** | PyPDF (PDF text extraction), python-docx (DOCX extraction), TXT UTF-8/Latin-1 |
| **Database** | SQLite3 (`searchlab.db`) with tables for `documents` and `search_history` |

---

## 🚀 Key Features & Interactive Laboratories

### 1. Overview Dashboard
- Live animated statistics fetched from SQLite backend:
  - Indexed Documents count
  - Unique Vocabulary size
  - Total Search Operations executed
  - Average Search Response Time (sub-millisecond latency)
- Interactive 5-stage Information Retrieval Pipeline diagram.
- Recharts visualizations: Corpus Topic Distribution Donut Chart and Top Frequent Vocabulary Bar Chart.

### 2. Explore Search Engine
- Real working search engine with large input bar and typeahead autocomplete suggestions.
- Live execution timing ($< 1$ ms) and number of relevant hits.
- Advanced search filters:
  - Filter by Academic Category (AI, ML, NLP, IR, Search Engines, Database Systems, etc.)
  - Minimum Cosine Similarity threshold slider ($0.0 - 0.5$)
  - Sorting options: Relevance (Cosine Sim DESC), Document Title (A-Z), Word Count (DESC)
- Result cards featuring:
  - Relevance percentage and Cosine Similarity coefficient
  - Colored relevance score progress bar
  - Contextual preview snippet with matched query keywords wrapped in highlighted `<mark>` tags
  - Intersected keyword stems chips
  - Dot product and document Euclidean norm metadata
  - Clear no-results fallback state with suggestions
- Direct 1-click bridge to the 7-Step Live Search Demonstration.

### 3. 7-Step Live Search Demonstration
A dedicated interactive stepper mode showing real mathematical calculations:
- **Step 1: Query Acquisition** — Raw query string, character count, and arrival timestamp.
- **Step 2: NLP Preprocessing** — Applied NLTK normalization stages, stopword removal, and Porter stems.
- **Step 3: Inverted Index Lookup** — Dictionary hash lookups, DF counts, candidate document ID postings.
- **Step 4: TF-IDF Query Vector Generation** — Query term weights $TF \times IDF$ and vector Euclidean length $\|\vec{Q}\|$.
- **Step 5: Cosine Similarity Calculation** — Exact formula evaluation table showing $(Q \cdot D) / (\|\vec{Q}\| \times \|\vec{D}\|)$ for each candidate document.
- **Step 6: Document Ranking** — Sorted descending relevance leaderboard with percentage scores.
- **Step 7: Results Presentation** — Final snippet cards and link back to full search SERP.
- Automatic **Play / Pause** animation timer (3-second step progression) or manual next/previous navigation.

### 4. Document Explorer & File Upload
- Drag-and-drop file upload zone supporting **PDF**, **DOCX**, and **TXT** files.
- Custom text document creator modal.
- Document cards displaying word count, file size in KB, category, and "Indexed" status.
- Document inspection modal displaying raw text and top characteristic TF-IDF terms.
- Document deletion with automatic inverted index and TF-IDF matrix recalculation.
- "Reset 16 Samples" button restoring the default curated academic corpus.

### 5. 6-Stage NLP Playground
Interactive text laboratory demonstrating the transformation of any user sentence across 6 distinct visual cards:
- **Stage 1: Original Text Input**
- **Stage 2: Lowercase Normalization**
- **Stage 3: NLTK Tokenization**
- **Stage 4: Punctuation & Special Character Removal**
- **Stage 5: Stopword Removal** (using NLTK English stopword lexicon)
- **Stage 6: Morphological Stemming** (Porter stemmer affix reductions)
- Displays removed punctuation/stopwords and a before/after affix mapping table (e.g. `retrieval` $\to$ `retriev`).
- Explains the algorithmic purpose and impact on search recall for each stage.

### 6. Inverted Index Lab
- Full tabular exploration of the inverted index: `Term | Document Frequency (DF) | Total TF | Posting List`.
- Dictionary search bar with live filtering and sorting by DF, TF, or Alphabetical.
- Interactive Posting Inspector: select any term to view its document postings, term frequency in each document, and exact word offset positions.
- Summary KPI counters: Total Unique Vocabulary, Total Indexed Tokens, and Average Document Length.

### 7. TF-IDF Mathematical Visualizer
- Clear conceptual explanations of Term Frequency ($TF$), Inverse Document Frequency ($IDF$), and composite weights.
- Document selector revealing the top 25 highest-weighted terms for any selected document with visual weight bars.
- Interactive 2D Document-Term Heatmap Matrix displaying term saliency across documents.

### 8. Similarity Analyzer
- Vector Space Model comparison tool with a horizontal comparative bar chart for top matching documents.
- Detailed step-by-step mathematical breakdown for each candidate:
  - Vector dot product $A \cdot B$
  - Query vector length $\|A\|$ and Document vector length $\|B\|$
  - Exact quotient formula: $\frac{\text{Numerator}}{\text{Denominator}} = \text{Score}$

### 9. Search Engine Architecture
- Interactive architectural flow diagram illustrating:
  1. User Query
  2. Query Processing
  3. Document Collection
  4. Text Preprocessing
  5. Inverted Index
  6. TF-IDF Calculation
  7. Similarity Calculation
  8. Ranking Algorithm
  9. Search Results
- Clickable component inspector detailing:
  - **What it does**
  - **Why it is required**
  - **How it works internally**
  - **Python libraries used** (FastAPI, NLTK, NumPy, Scikit-learn, SQLite3)

### 10. About & Academic Documentation
- B.Tech Computer Science Engineering practical documentation.
- Project objectives, system specifications, theoretical background on Information Retrieval and Vector Space Models, and practical conclusion.

---

## 📂 Project Organization

```
searchlab-ai/
├── backend/
│   ├── main.py               # FastAPI application, CORS, and API endpoints
│   ├── database.py           # SQLite3 database schema, CRUD, and history logging
│   ├── models.py             # Pydantic request and response schemas
│   ├── preprocessing.py      # NLTK 6-stage pipeline and file text extraction
│   ├── indexing.py           # InvertedIndex data structure and posting manager
│   ├── search_engine.py      # TF-IDF vectorizer, Cosine Similarity, and live trace
│   ├── searchlab.db          # SQLite persistent database (auto-created)
│   ├── requirements.txt      # Python dependencies
│   └── sample_data/
│       └── samples.py        # 16 default curated academic computer science documents
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx    # Responsive navigation bar with theme toggle
│   │   │   ├── Footer.tsx    # Academic footer and stack badges
│   │   │   ├── StatCard.tsx  # Glowing laboratory KPI card
│   │   │   └── Toast.tsx     # Toast notification system
│   │   ├── pages/
│   │   │   ├── OverviewPage.tsx         # Dashboard, pipeline flow, and charts
│   │   │   ├── SearchPage.tsx           # Search engine, autocomplete, and filters
│   │   │   ├── LiveDemoPage.tsx         # 7-step animated execution trace
│   │   │   ├── DocumentExplorerPage.tsx # File uploads, custom text, and inspector
│   │   │   ├── NlpPlaygroundPage.tsx    # 6-stage NLP text transformation
│   │   │   ├── InvertedIndexPage.tsx    # Inverted index posting list explorer
│   │   │   ├── TfidfVisualizerPage.tsx  # TF-IDF heatmap and term weights
│   │   │   ├── SimilarityAnalyzerPage.tsx # Cosine similarity formula breakdown
│   │   │   ├── ArchitecturePage.tsx     # Interactive system architecture map
│   │   │   └── AboutPage.tsx            # B.Tech project documentation & viva
│   │   ├── services/
│   │   │   └── api.ts        # Axios API service connecting to FastAPI backend
│   │   ├── types/
│   │   │   └── index.ts      # TypeScript interfaces and types
│   │   ├── App.tsx           # Main application shell and state manager
│   │   ├── index.css         # Tailwind CSS, custom dark theme, glassmorphism
│   │   └── main.tsx          # React 19 entrypoint
│   ├── package.json
│   ├── vite.config.ts        # Vite configuration with proxy to FastAPI
│   └── tsconfig.json
│
├── run_backend.bat           # Windows script to start FastAPI backend
├── run_frontend.bat          # Windows script to start Vite dev server
├── start_all.bat             # Starts both backend and frontend simultaneously
├── start_app.py              # Cross-platform Python launcher
├── .gitignore
└── README.md
```

---

## 🏃 Local Setup & Execution Guide

### Prerequisites
1. **Python 3.10+** (Python 3.15 supported)
2. **Node.js 18+** & **npm**

### Step 1: Clone or Navigate to the Project
```bash
cd searchlab-ai
```

### Step 2: Set Up Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab'); nltk.download('stopwords')"
```

### Step 3: Set Up Frontend
```bash
cd ../frontend
npm install
npm run build
```

### Step 4: Run the Application
You can run the application using any of the following methods:

#### Option A: One-Click Launcher (Windows)
Double-click `start_all.bat` in the `searchlab-ai` root folder. It starts both the FastAPI backend and the Vite dev server.

#### Option B: Standalone Python Runner
From the root folder:
```bash
python start_app.py
```
This launches the FastAPI backend on `http://127.0.0.1:8000` (which serves both the REST API and the compiled React production SPA) and opens your browser automatically.

#### Option C: Manual Terminal Execution
- **Terminal 1 (Backend)**:
  ```bash
  cd searchlab-ai/backend
  python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  cd searchlab-ai/frontend
  npm run dev
  ```
Open `http://localhost:5173` in your browser.

---

## 📚 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Dashboard statistics, topic distribution, top terms |
| `POST` | `/api/search` | Execute TF-IDF & Cosine Similarity search with filters |
| `POST` | `/api/search/trace` | Get 7-step mathematical demonstration trace |
| `GET` | `/api/search/suggestions` | Typeahead term and title suggestions |
| `GET` | `/api/search/history` | Retrieve recent query logs |
| `DELETE` | `/api/search/history` | Clear search query history |
| `GET` | `/api/documents` | List all indexed documents |
| `GET` | `/api/documents/{id}` | Inspect single document content and top TF-IDF terms |
| `POST` | `/api/documents/upload` | Upload PDF, DOCX, or TXT file with automatic indexing |
| `POST` | `/api/documents` | Create custom text document |
| `DELETE` | `/api/documents/{id}` | Delete document and rebuild inverted index |
| `POST` | `/api/documents/reset-samples` | Reset collection to 16 default sample documents |
| `POST` | `/api/preprocess` | Execute 6-stage NLP text transformation pipeline |
| `GET` | `/api/inverted-index` | Paginated inverted index with search and sorting |
| `GET` | `/api/tfidf` | TF-IDF heatmap and document-term matrix |
| `POST` | `/api/similarity` | Cosine similarity vectors, norms, and formula breakdown |
| `GET` | `/api/architecture` | Architecture components data for interactive diagram |
| `GET` | `/api/analytics` | System analytics and vocabulary metrics |

Interactive OpenAPI documentation is available at `http://127.0.0.1:8000/docs`.

---

## 🎓 Academic Viva Questions & Answers

### Q1: What is an Inverted Index and why is it essential for search engines?
**Answer**: An Inverted Index is an associative dictionary mapping each unique word in a corpus to a "posting list" of document IDs and positions where that word occurs. Without an inverted index, searching requires sequentially scanning all files ($O(N \times L)$). With an inverted index, multi-word queries are resolved by intersecting posting lists in $O(L_1 + L_2)$ time, enabling sub-millisecond search across billions of documents.

### Q2: What is the formula for TF-IDF and what does each component represent?
**Answer**:
- **Term Frequency ($TF$)**: $TF(t, d) = \frac{\text{count}(t, d)}{\text{total words in } d}$. Measures local term frequency normalized by document length.
- **Inverse Document Frequency ($IDF$)**: $IDF(t) = \ln\left(\frac{N + 1}{DF(t) + 1}\right) + 1$. Quantifies the rarity of term $t$ across the collection ($N$ documents, $DF(t)$ documents containing $t$).
- **Composite Weight**: $TF\text{-}IDF(t, d) = TF(t, d) \times IDF(t)$. Rare, domain-specific words that appear frequently in a document receive the highest weights.

### Q3: Why is Cosine Similarity preferred over Euclidean Distance in text retrieval?
**Answer**: Euclidean distance is heavily distorted by document length. A short 50-word document and a comprehensive 5,000-word document discussing the exact same topic will have vectors of radically different magnitudes, resulting in a large Euclidean distance. Cosine Similarity measures the cosine of the angle between vectors:
$$\text{Cosine Similarity} = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \times \|\vec{B}\|}$$
Because the dot product is divided by the product of vector norms, it is length-normalized and evaluates pure topical orientation.

---

## ☁️ Deployment on Vercel

SearchLab AI is configured for one-click deployment on Vercel as a hybrid application:
- **Frontend SPA**: Built via Vite (`npm run build`) and served globally on Vercel's Edge Network via `outputDirectory: "frontend/dist"`.
- **Backend API**: Powered by Python Serverless Functions in `api/index.py` with automatic SQLite persistence in `/tmp/searchlab.db` and on-demand NLTK package hydration.

### Deploying via Vercel CLI:
```bash
vercel --prod
```

### Deploying via GitHub Integration:
1. Push this repository to your GitHub account.
2. Go to [vercel.com](https://vercel.com) and click **"Add New... > Project"**.
3. Import the `searchlab-ai` repository.
4. Click **Deploy** (Vercel automatically detects `vercel.json` and builds both frontend and Python serverless functions).

---

## 👥 Authors & Academic Credits
- **Project Name**: SearchLab AI – Information Retrieval & Search Engine Using NLP
- **Degree**: Bachelor of Technology (B.Tech) in Computer Science & Engineering (CSE)
- **Year**: 2026
