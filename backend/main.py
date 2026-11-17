"""
SearchLab AI - FastAPI Application
Main entrypoint providing NLP, Inverted Index, TF-IDF, Cosine Similarity, and Document Management APIs.
"""

import os
import time
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from database import (
    init_db, get_all_documents, get_document_by_id, insert_document,
    delete_document, record_search, get_search_history, clear_search_history,
    clear_all_documents, get_dashboard_stats
)
from preprocessing import run_pipeline, clean_and_tokenize, extract_text_from_file
from indexing import global_index
from search_engine import global_search_engine
from models import (
    SearchRequest, PreprocessRequest, CustomDocumentRequest,
    SimilarityRequest, LiveTraceRequest
)
from sample_data.samples import SAMPLE_DOCUMENTS

# Architecture Metadata for Section 11
ARCHITECTURE_COMPONENTS = [
    {
        "id": "user_query",
        "step_num": 1,
        "name": "User Query",
        "category": "Query Pipeline",
        "what": "The natural language text input entered by the user expressing their informational need.",
        "why": "Initiates the information retrieval process; defines the semantic target for matching.",
        "how": "Captures raw keystrokes, provides auto-completion suggestions, and transmits the string to the API backend.",
        "python_library": "FastAPI, Pydantic"
    },
    {
        "id": "query_processing",
        "step_num": 2,
        "name": "Query Processing",
        "category": "Query Pipeline",
        "what": "Linguistic normalization, tokenization, punctuation removal, stopword filtering, and morphological stemming of the query.",
        "why": "Harmonizes user query vocabulary with the indexed document representations.",
        "how": "Executes the identical 6-stage NLP pipeline used during document ingestion so query words match canonical index terms.",
        "python_library": "NLTK (word_tokenize, PorterStemmer, stopwords)"
    },
    {
        "id": "doc_collection",
        "step_num": 3,
        "name": "Document Collection",
        "category": "Indexing Pipeline",
        "what": "The corpus of textual documents (PDF, DOCX, TXT, or web text) stored for retrieval.",
        "why": "Provides the knowledge repository from which relevant information must be located.",
        "how": "Files are stored in SQLite database with metadata (word count, file type, timestamps) and unique doc IDs (D1, D2, ...).",
        "python_library": "SQLite3, PyPDF, python-docx"
    },
    {
        "id": "text_preprocessing",
        "step_num": 4,
        "name": "Text Preprocessing",
        "category": "Indexing Pipeline",
        "what": "Automated pipeline that transforms raw document text into clean, normalized token sequences.",
        "why": "Removes orthographic noise, normalizes cases, and strips high-frequency non-informative stopwords.",
        "how": "Lowercases, tokenizes, removes non-alphanumeric punctuation, filters against English stopword sets, and stems words to root affixes.",
        "python_library": "NLTK, Regular Expressions (re)"
    },
    {
        "id": "inverted_index",
        "step_num": 5,
        "name": "Inverted Index",
        "category": "Core Data Structure",
        "what": "Hash table mapping every distinct vocabulary term to its posting list of document IDs, frequencies, and positions.",
        "why": "Permits sub-millisecond retrieval across millions of documents without linearly scanning raw files.",
        "how": "Populates hash dictionary: term -> {df, total_tf, postings: [{doc_id, tf, positions}]}. Allows immediate posting intersection.",
        "python_library": "Python collections (defaultdict), Custom InvertedIndex class"
    },
    {
        "id": "tfidf_calculation",
        "step_num": 6,
        "name": "TF-IDF Weighting",
        "category": "Vector Space Model",
        "what": "Calculates Term Frequency (TF) and Inverse Document Frequency (IDF) weights for vocabulary terms in documents and queries.",
        "why": "Rewards terms frequent in specific documents while heavily penalizing terms ubiquitous across the whole corpus.",
        "how": "TF(t, d) = count / length; IDF(t) = ln((N+1)/(DF+1)) + 1; Vector weight = TF * IDF.",
        "python_library": "Python math module, Custom TF-IDF implementation"
    },
    {
        "id": "similarity_calculation",
        "step_num": 7,
        "name": "Cosine Similarity",
        "category": "Ranking Engine",
        "what": "Computes normalized vector dot product between the query vector and candidate document vectors.",
        "why": "Measures angle between vectors in high-dimensional semantic space, completely invariant to document length differences.",
        "how": "Cosine Sim = (Q · D) / (||Q|| × ||D||). Produces score bounded between 0.0 (unrelated) and 1.0 (exact match).",
        "python_library": "Python math module (dot product, vector norm), Custom cosine similarity"
    },
    {
        "id": "ranking_algorithm",
        "step_num": 8,
        "name": "Ranking Algorithm",
        "category": "Ranking Engine",
        "what": "Sorts candidate documents in descending order of computed relevance scores and applies thresholds.",
        "why": "Ensures the most relevant documents appear at the top of the search engine results page (SERP).",
        "how": "Sorts candidate objects by similarity_score DESC, filters out sub-threshold noise, and assigns ordinal ranks #1, #2, #3...",
        "python_library": "Python built-in Timsort (sort with key lambda)"
    },
    {
        "id": "search_results",
        "step_num": 9,
        "name": "Search Results & Snippets",
        "category": "Output & Presentation",
        "what": "The final user-facing response including ranked titles, relevance percentages, matching keywords, and highlighted snippets.",
        "why": "Allows users to quickly evaluate document utility and locate query terms in context.",
        "how": "Selects sentences with highest query overlap, inserts <mark> HTML tags around matching keywords, and returns structured JSON.",
        "python_library": "FastAPI JSONResponse, Regular Expressions"
    }
]

def seed_sample_documents_if_empty():
    """Seeds the SQLite database with 16 default sample documents if empty."""
    existing = get_all_documents()
    if not existing:
        print("[SearchLab AI] Seeding initial sample documents...")
        for doc in SAMPLE_DOCUMENTS:
            tokens = clean_and_tokenize(doc["content"])
            word_count = len(doc["content"].split())
            file_size = len(doc["content"].encode('utf-8'))
            insert_document(
                title=doc["title"],
                category=doc["category"],
                filename=doc["filename"],
                file_type=doc["file_type"],
                file_size=file_size,
                word_count=word_count,
                content=doc["content"],
                processed_tokens=tokens
            )
        print(f"[SearchLab AI] Successfully seeded {len(SAMPLE_DOCUMENTS)} sample documents.")

def reload_search_engine():
    """Reloads all documents from SQLite into global search engine and inverted index."""
    docs = get_all_documents()
    global_search_engine.index_collection(docs)
    print(f"[SearchLab AI] Search engine re-indexed {len(docs)} documents ({len(global_search_engine.vocabulary)} unique terms).")

def ensure_initialized():
    """Guarantees database and search engine are initialized in both local and serverless environments."""
    init_db()
    seed_sample_documents_if_empty()
    if not global_search_engine.documents:
        reload_search_engine()

# Automatically initialize on module import for serverless cold starts
ensure_initialized()

@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_initialized()
    yield
    # Shutdown

app = FastAPI(
    title="SearchLab AI - Information Retrieval & Search Engine API",
    description="Interactive NLP and Information Retrieval educational laboratory backend",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# 1. OVERVIEW & DASHBOARD
# -------------------------------------------------------------
@app.get("/api/dashboard")
async def get_dashboard():
    """Returns overview statistics: indexed documents, vocabulary size, search ops, avg search time."""
    stats = get_dashboard_stats()
    vocab_summary = global_index.get_vocabulary_summary()
    recent_searches = get_search_history(limit=5)
    
    return {
        "status": "success",
        "statistics": {
            "indexed_documents": stats["indexed_documents"],
            "unique_vocabulary": vocab_summary["unique_vocabulary_count"],
            "total_tokens_indexed": vocab_summary["total_tokens_indexed"],
            "search_operations": stats["search_operations"],
            "avg_search_time_ms": stats["avg_search_time_ms"],
            "total_corpus_words": stats["total_words"]
        },
        "category_distribution": stats["category_distribution"],
        "top_frequent_terms": vocab_summary["top_terms_by_tf"][:8],
        "recent_searches": recent_searches
    }

# -------------------------------------------------------------
# 2. EXPLORE SEARCH
# -------------------------------------------------------------
@app.post("/api/search")
async def search_documents(request: SearchRequest):
    """Executes search using TF-IDF and Cosine Similarity."""
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    results_data = global_search_engine.search(
        query=query,
        category_filter=request.category_filter,
        min_score=request.min_score or 0.0,
        sort_by=request.sort_by or "relevance",
        top_k=request.top_k
    )

    top_title = results_data["results"][0]["title"] if results_data["results"] else None
    top_sim = results_data["results"][0]["similarity_score"] if results_data["results"] else None

    # Record search operation in history
    record_search(
        query=query,
        results_count=results_data["total_results"],
        execution_time_ms=results_data["execution_time_ms"],
        top_doc_title=top_title,
        top_similarity=top_sim
    )

    return {
        "status": "success",
        **results_data
    }

@app.get("/api/search/suggestions")
async def get_search_suggestions(q: str = Query(..., min_length=1)):
    """Provides typeahead suggestions based on indexed vocabulary and sample terms."""
    q_lower = q.lower().strip()
    matches = []
    
    # Check vocabulary terms starting with query
    for term in global_search_engine.vocabulary:
        if term.startswith(q_lower):
            matches.append(term)
            if len(matches) >= 8:
                break
                
    # Also check document titles
    title_matches = []
    for doc in global_search_engine.documents:
        if q_lower in doc["title"].lower():
            title_matches.append(doc["title"])
            if len(title_matches) >= 3:
                break

    return {
        "query": q,
        "term_suggestions": matches,
        "title_suggestions": title_matches
    }

@app.get("/api/search/history")
async def get_history(limit: int = 20):
    """Retrieves recent search history."""
    history = get_search_history(limit=limit)
    return {"status": "success", "history": history}

@app.delete("/api/search/history")
async def clear_history():
    """Clears search history."""
    clear_search_history()
    return {"status": "success", "message": "Search history cleared successfully"}

# -------------------------------------------------------------
# 3. LIVE SEARCH DEMONSTRATION
# -------------------------------------------------------------
@app.post("/api/search/trace")
async def get_live_search_trace(request: LiveTraceRequest):
    """Calculates and returns 7-step interactive execution trace with real calculations."""
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty for demonstration trace")

    trace_data = global_search_engine.get_live_search_trace(query)
    return {
        "status": "success",
        **trace_data
    }

# -------------------------------------------------------------
# 4. DOCUMENT EXPLORER
# -------------------------------------------------------------
@app.get("/api/documents")
async def list_documents():
    """Lists all indexed documents."""
    docs = get_all_documents()
    categories = sorted(list(set(d["category"] for d in docs)))
    return {
        "status": "success",
        "total_documents": len(docs),
        "categories": categories,
        "documents": docs
    }

@app.get("/api/documents/{doc_id}")
async def get_single_document(doc_id: str):
    """Gets complete document contents, token breakdown, and top TF-IDF terms."""
    doc = get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found")

    top_terms = global_search_engine.doc_tf_idf_terms.get(doc["doc_id"], [])[:25]

    return {
        "status": "success",
        "document": doc,
        "top_tfidf_terms": top_terms
    }

@app.post("/api/documents")
async def create_custom_document(request: CustomDocumentRequest):
    """Creates a custom text document, indexes it, and updates TF-IDF vectors."""
    try:
        clean_title = request.title.strip() if request.title else "Untitled Document"
        content = request.content.strip()
        category = (request.category or "General").strip()
        if not category:
            category = "General"

        if not content:
            raise HTTPException(status_code=400, detail="Document content cannot be empty.")

        tokens = clean_and_tokenize(content)
        word_count = len(content.split())
        file_size = len(content.encode('utf-8'))
        safe_name = "".join(c for c in clean_title.lower() if c.isalnum() or c in (' ', '_', '-')).replace(' ', '_')[:35]
        filename = f"{safe_name or 'document'}.txt"

        created_doc = insert_document(
            title=clean_title,
            category=category,
            filename=filename,
            file_type="txt",
            file_size=file_size,
            word_count=word_count,
            content=content,
            processed_tokens=tokens
        )

        # Re-index collection
        reload_search_engine()

        return {
            "status": "success",
            "message": f"Document '{clean_title}' successfully created and indexed as {created_doc['doc_id']}.",
            "document": created_doc
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create document: {str(e)}")

@app.post("/api/documents/upload")
async def upload_document_file(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    category: Optional[str] = Form("Uploaded")
):
    """Uploads PDF, DOCX, or TXT file, parses text, and indexes it into the system."""
    contents = await file.read()
    filename = file.filename or "uploaded_document.txt"
    file_size = len(contents)

    # Extract text using NLTK / PyPDF / python-docx
    extracted_text, file_type = extract_text_from_file(contents, filename)
    
    if not extracted_text or extracted_text.startswith("Error extracting"):
        raise HTTPException(status_code=400, detail=f"Failed to extract readable text from '{filename}'.")

    doc_title = title.strip() if (title and title.strip()) else filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
    tokens = clean_and_tokenize(extracted_text)
    word_count = len(extracted_text.split())

    created_doc = insert_document(
        title=doc_title,
        category=category or "Uploaded",
        filename=filename,
        file_type=file_type,
        file_size=file_size,
        word_count=word_count,
        content=extracted_text,
        processed_tokens=tokens
    )

    # Re-index collection
    reload_search_engine()

    return {
        "status": "success",
        "message": f"File '{filename}' processed. Extracted {word_count} words and {len(tokens)} indexable tokens.",
        "document": created_doc
    }

@app.delete("/api/documents/{doc_id}")
async def remove_document(doc_id: str):
    """Deletes a document and recalculates the inverted index and TF-IDF matrices."""
    success = delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found")

    reload_search_engine()
    return {
        "status": "success",
        "message": f"Document '{doc_id}' deleted and index rebuilt."
    }

@app.post("/api/documents/reset-samples")
async def reset_sample_documents():
    """Resets the collection to the original 16 sample documents."""
    clear_all_documents()
    seed_sample_documents_if_empty()
    reload_search_engine()
    return {
        "status": "success",
        "message": f"Collection reset to {len(SAMPLE_DOCUMENTS)} default sample documents."
    }

# -------------------------------------------------------------
# 5. NLP PLAYGROUND
# -------------------------------------------------------------
@app.post("/api/preprocess")
async def preprocess_text(request: PreprocessRequest):
    """Executes the interactive 6-stage NLP text preprocessing pipeline."""
    text = request.text
    if not text:
        text = "Information Retrieval Systems help users find relevant information."
        
    pipeline_result = run_pipeline(text)
    return {
        "status": "success",
        **pipeline_result
    }

# -------------------------------------------------------------
# 6. INVERTED INDEX LAB
# -------------------------------------------------------------
@app.get("/api/inverted-index")
async def get_inverted_index(
    q: Optional[str] = None,
    sort_by: str = "df",
    page: int = 1,
    page_size: int = 40
):
    """Retrieves paginated Inverted Index records, supporting search and sorting."""
    data = global_index.get_all_entries(
        search_filter=q,
        sort_by=sort_by,
        page=page,
        page_size=page_size
    )
    summary = global_index.get_vocabulary_summary()
    return {
        "status": "success",
        "summary": summary,
        **data
    }

# -------------------------------------------------------------
# 7. TF-IDF VISUALIZER
# -------------------------------------------------------------
@app.get("/api/tfidf")
async def get_tfidf_visualizer_data(
    doc_id: Optional[str] = None,
    top_k: int = 20,
    matrix_terms: int = 12,
    matrix_docs: int = 8
):
    """Provides document-term matrix heatmap and TF-IDF analysis."""
    data = global_search_engine.get_tfidf_data(
        doc_id=doc_id,
        top_k_terms=top_k,
        matrix_terms_count=matrix_terms,
        matrix_docs_count=matrix_docs
    )
    return {
        "status": "success",
        **data
    }

# -------------------------------------------------------------
# 8. SIMILARITY ANALYZER
# -------------------------------------------------------------
@app.post("/api/similarity")
async def analyze_cosine_similarity(request: SimilarityRequest):
    """Calculates cosine similarity vectors and formula breakdowns."""
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    data = global_search_engine.analyze_similarity(query=query, top_k=request.top_k or 5)
    return {
        "status": "success",
        **data
    }

# -------------------------------------------------------------
# 9. ARCHITECTURE & ANALYTICS
# -------------------------------------------------------------
@app.get("/api/architecture")
async def get_architecture():
    """Returns the Search Engine Architecture flow components for interactive visualization."""
    return {
        "status": "success",
        "components": ARCHITECTURE_COMPONENTS
    }

@app.get("/api/analytics")
async def get_analytics():
    """Returns analytics data for educational inspection."""
    vocab_summary = global_index.get_vocabulary_summary()
    dash_stats = get_dashboard_stats()
    recent = get_search_history(limit=25)

    return {
        "status": "success",
        "summary": dash_stats,
        "vocabulary_stats": vocab_summary,
        "recent_queries": recent
    }

# Mount frontend dist static files if built
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        # Don't intercept API endpoints
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
