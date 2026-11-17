"""
SearchLab AI - Database Layer
Manages SQLite storage for indexed documents, search histories, and metadata.
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

import shutil

# On Vercel / AWS Lambda, the local deployment directory is read-only.
# We redirect the SQLite database to /tmp and copy the pre-seeded DB if needed.
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    DB_PATH = "/tmp/searchlab.db"
    src_db = os.path.join(os.path.dirname(__file__), "searchlab.db")
    if not os.path.exists(DB_PATH) and os.path.exists(src_db):
        try:
            shutil.copyfile(src_db, DB_PATH)
        except Exception as e:
            print(f"[Database] Warning copying seed DB to /tmp: {e}")
else:
    DB_PATH = os.path.join(os.path.dirname(__file__), "searchlab.db")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create documents table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            filename TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            word_count INTEGER NOT NULL,
            content TEXT NOT NULL,
            processed_tokens TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    
    # Create search_history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS search_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            results_count INTEGER NOT NULL,
            execution_time_ms REAL NOT NULL,
            top_doc_title TEXT,
            top_similarity REAL,
            searched_at TEXT NOT NULL
        )
    """)
    
    conn.commit()
    conn.close()

def get_all_documents() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents ORDER BY id ASC")
    rows = cursor.fetchall()
    docs = []
    for r in rows:
        docs.append({
            "id": r["id"],
            "doc_id": r["doc_id"],
            "title": r["title"],
            "category": r["category"],
            "filename": r["filename"],
            "file_type": r["file_type"],
            "file_size": r["file_size"],
            "word_count": r["word_count"],
            "content": r["content"],
            "processed_tokens": json.loads(r["processed_tokens"]) if r["processed_tokens"] else [],
            "created_at": r["created_at"],
            "indexed_status": "Indexed"
        })
    conn.close()
    return docs

def get_document_by_id(doc_id_or_num: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    if doc_id_or_num.isdigit():
        cursor.execute("SELECT * FROM documents WHERE id = ? OR doc_id = ?", (int(doc_id_or_num), f"D{doc_id_or_num}"))
    else:
        cursor.execute("SELECT * FROM documents WHERE doc_id = ?", (doc_id_or_num,))
    r = cursor.fetchone()
    conn.close()
    if not r:
        return None
    return {
        "id": r["id"],
        "doc_id": r["doc_id"],
        "title": r["title"],
        "category": r["category"],
        "filename": r["filename"],
        "file_type": r["file_type"],
        "file_size": r["file_size"],
        "word_count": r["word_count"],
        "content": r["content"],
        "processed_tokens": json.loads(r["processed_tokens"]) if r["processed_tokens"] else [],
        "created_at": r["created_at"],
        "indexed_status": "Indexed"
    }

def insert_document(
    title: str,
    category: str,
    filename: str,
    file_type: str,
    file_size: int,
    word_count: int,
    content: str,
    processed_tokens: List[str]
) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Calculate next collision-free doc_id
    cursor.execute("SELECT doc_id FROM documents")
    existing_doc_ids = set(r["doc_id"] for r in cursor.fetchall())
    
    max_num = 0
    for d in existing_doc_ids:
        if d.startswith("D") and d[1:].isdigit():
            max_num = max(max_num, int(d[1:]))
            
    next_id = max_num + 1
    doc_id = f"D{next_id}"
    while doc_id in existing_doc_ids:
        next_id += 1
        doc_id = f"D{next_id}"
        
    created_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("""
        INSERT INTO documents (
            doc_id, title, category, filename, file_type, 
            file_size, word_count, content, processed_tokens, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        doc_id, title, category, filename, file_type,
        file_size, word_count, content, json.dumps(processed_tokens), created_at
    ))
    new_pk = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {
        "id": new_pk,
        "doc_id": doc_id,
        "title": title,
        "category": category,
        "filename": filename,
        "file_type": file_type,
        "file_size": file_size,
        "word_count": word_count,
        "content": content,
        "processed_tokens": processed_tokens,
        "created_at": created_at,
        "indexed_status": "Indexed"
    }

def delete_document(id_or_doc_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    if id_or_doc_id.isdigit():
        cursor.execute("DELETE FROM documents WHERE id = ?", (int(id_or_doc_id),))
    else:
        cursor.execute("DELETE FROM documents WHERE doc_id = ?", (id_or_doc_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def record_search(
    query: str,
    results_count: int,
    execution_time_ms: float,
    top_doc_title: Optional[str] = None,
    top_similarity: Optional[float] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    searched_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        INSERT INTO search_history (
            query, results_count, execution_time_ms, top_doc_title, top_similarity, searched_at
        ) VALUES (?, ?, ?, ?, ?, ?)
    """, (query, results_count, execution_time_ms, top_doc_title, top_similarity, searched_at))
    conn.commit()
    conn.close()

def get_search_history(limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM search_history ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    history = []
    for r in rows:
        history.append({
            "id": r["id"],
            "query": r["query"],
            "results_count": r["results_count"],
            "execution_time_ms": round(r["execution_time_ms"], 2),
            "top_doc_title": r["top_doc_title"] or "N/A",
            "top_similarity": round(r["top_similarity"] * 100, 1) if r["top_similarity"] is not None else 0.0,
            "searched_at": r["searched_at"]
        })
    conn.close()
    return history

def clear_search_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM search_history")
    conn.commit()
    conn.close()

def clear_all_documents():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM documents")
    conn.commit()
    conn.close()

def get_dashboard_stats() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as doc_count, SUM(word_count) as total_words FROM documents")
    doc_row = cursor.fetchone()
    doc_count = doc_row["doc_count"] or 0
    total_words = doc_row["total_words"] or 0
    
    cursor.execute("SELECT COUNT(*) as search_count, AVG(execution_time_ms) as avg_time FROM search_history")
    search_row = cursor.fetchone()
    search_ops = search_row["search_count"] or 0
    avg_search_time = round(search_row["avg_time"] or 0.0, 2)
    
    # Category counts
    cursor.execute("SELECT category, COUNT(*) as count FROM documents GROUP BY category ORDER BY count DESC")
    category_counts = [{"name": r["category"], "value": r["count"]} for r in cursor.fetchall()]
    
    conn.close()
    
    return {
        "indexed_documents": doc_count,
        "total_words": total_words,
        "search_operations": search_ops,
        "avg_search_time_ms": avg_search_time,
        "category_distribution": category_counts
    }
