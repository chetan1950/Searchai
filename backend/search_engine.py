"""
SearchLab AI - Search Engine & Vector Space Information Retrieval Model
Implements TF-IDF vectorization, Cosine Similarity ranking, and detailed IR calculation traces.
Uses pure Python math (no numpy/scikit-learn) for lightweight serverless deployment.
"""

import math
import time
import re
from typing import List, Dict, Any, Optional, Tuple
from collections import Counter
from preprocessing import clean_and_tokenize, run_pipeline
from indexing import global_index


def _dot_product(a: List[float], b: List[float]) -> float:
    """Compute dot product of two equal-length vectors."""
    return sum(x * y for x, y in zip(a, b))


def _vector_norm(v: List[float]) -> float:
    """Compute Euclidean (L2) norm of a vector."""
    return math.sqrt(sum(x * x for x in v))


class SearchEngine:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.doc_map: Dict[str, Dict[str, Any]] = {}
        self.vocabulary: List[str] = []
        self.vocab_index: Dict[str, int] = {}
        self.idf_dict: Dict[str, float] = {}
        # Document vectors: doc_id -> list of floats (length = len(vocabulary))
        self.doc_vectors: Dict[str, List[float]] = {}
        self.doc_norms: Dict[str, float] = {}
        self.doc_tf_idf_terms: Dict[str, List[Dict[str, Any]]] = {}

    def index_collection(self, docs: List[Dict[str, Any]]):
        """
        Indexes the collection, updates the inverted index, builds vocabulary,
        computes IDFs, and precomputes document TF-IDF vectors and norms.
        """
        self.documents = docs
        self.doc_map = {d["doc_id"]: d for d in docs}
        
        # 1. Update inverted index
        global_index.build_index(docs)
        
        # 2. Extract unique sorted vocabulary
        vocab_set = set()
        for d in docs:
            vocab_set.update(d.get("processed_tokens", []))
        self.vocabulary = sorted(list(vocab_set))
        self.vocab_index = {term: idx for idx, term in enumerate(self.vocabulary)}
        
        N = len(docs)
        self.idf_dict.clear()
        self.doc_vectors.clear()
        self.doc_norms.clear()
        self.doc_tf_idf_terms.clear()

        if N == 0 or len(self.vocabulary) == 0:
            return

        # 3. Compute IDF for all terms in vocabulary
        # Standard smoothed IDF formula: idf(t) = ln((N + 1) / (df(t) + 1)) + 1
        for term in self.vocabulary:
            df = global_index.index.get(term, {}).get("df", 0)
            idf = math.log((N + 1.0) / (df + 1.0)) + 1.0
            self.idf_dict[term] = idf

        # 4. Compute TF-IDF vectors for every document
        V = len(self.vocabulary)
        for doc in docs:
            doc_id = doc["doc_id"]
            tokens = doc.get("processed_tokens", [])
            doc_len = max(1, len(tokens))
            term_counts = Counter(tokens)
            
            vector = [0.0] * V
            top_terms = []

            for term, count in term_counts.items():
                if term in self.vocab_index:
                    idx = self.vocab_index[term]
                    # Augmented / Normalized TF: tf = count / doc_len
                    tf = count / doc_len
                    idf = self.idf_dict[term]
                    tfidf_val = tf * idf
                    vector[idx] = tfidf_val
                    top_terms.append({
                        "term": term,
                        "raw_tf": count,
                        "tf": round(tf, 4),
                        "idf": round(idf, 4),
                        "tfidf": round(tfidf_val, 4)
                    })

            # Sort top terms for visualizer
            top_terms.sort(key=lambda x: x["tfidf"], reverse=True)
            self.doc_tf_idf_terms[doc_id] = top_terms

            norm = _vector_norm(vector)
            self.doc_vectors[doc_id] = vector
            self.doc_norms[doc_id] = norm if norm > 0 else 1.0

    def search(
        self,
        query: str,
        category_filter: Optional[str] = None,
        min_score: float = 0.0,
        sort_by: str = "relevance",
        top_k: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Executes real information retrieval search using TF-IDF and Cosine Similarity.
        """
        start_time = time.perf_counter()
        query_clean = query.strip()
        
        if not query_clean or not self.documents:
            return {
                "query": query,
                "execution_time_ms": 0.0,
                "total_results": 0,
                "results": [],
                "query_terms": []
            }

        # Preprocess query into clean tokens
        query_tokens = clean_and_tokenize(query_clean)
        
        if not query_tokens:
            return {
                "query": query,
                "execution_time_ms": round((time.perf_counter() - start_time) * 1000, 2),
                "total_results": 0,
                "results": [],
                "query_terms": []
            }

        # Vectorize query
        V = len(self.vocabulary)
        query_vector = [0.0] * V
        query_term_counts = Counter(query_tokens)
        q_len = max(1, len(query_tokens))

        query_term_details = []
        for term, count in query_term_counts.items():
            if term in self.vocab_index:
                idx = self.vocab_index[term]
                tf = count / q_len
                idf = self.idf_dict.get(term, 1.0)
                tfidf_val = tf * idf
                query_vector[idx] = tfidf_val
                query_term_details.append({
                    "term": term,
                    "count": count,
                    "tf": round(tf, 4),
                    "idf": round(idf, 4),
                    "tfidf": round(tfidf_val, 4)
                })

        q_norm = _vector_norm(query_vector)
        if q_norm == 0:
            q_norm = 1.0

        # Calculate cosine similarity against all candidate documents
        scored_docs = []
        for doc in self.documents:
            doc_id = doc["doc_id"]
            
            # Apply category filter if requested
            if category_filter and category_filter.lower() != "all":
                if doc["category"].lower() != category_filter.lower():
                    continue

            d_vec = self.doc_vectors.get(doc_id)
            if d_vec is None:
                continue

            # Dot product
            dot_product_val = _dot_product(query_vector, d_vec)
            d_norm = self.doc_norms.get(doc_id, 1.0)
            
            if dot_product_val > 0 and d_norm > 0:
                cosine_sim = dot_product_val / (q_norm * d_norm)
            else:
                cosine_sim = 0.0

            if cosine_sim >= min_score and cosine_sim > 0.0001:
                # Find matching terms
                doc_tokens = set(doc.get("processed_tokens", []))
                matched_terms = [t for t in query_tokens if t in doc_tokens]

                # Generate content snippet highlighting matched terms
                snippet = self._generate_snippet(doc["content"], query_clean, matched_terms)

                scored_docs.append({
                    "doc_id": doc_id,
                    "id": doc["id"],
                    "title": doc["title"],
                    "category": doc["category"],
                    "filename": doc["filename"],
                    "word_count": doc["word_count"],
                    "similarity_score": round(cosine_sim, 4),
                    "similarity_percentage": round(cosine_sim * 100, 1),
                    "dot_product": round(dot_product_val, 5),
                    "doc_norm": round(d_norm, 4),
                    "query_norm": round(q_norm, 4),
                    "matched_terms": list(set(matched_terms)),
                    "matched_terms_count": len(matched_terms),
                    "snippet": snippet
                })

        # Sort results
        if sort_by == "relevance":
            scored_docs.sort(key=lambda x: x["similarity_score"], reverse=True)
        elif sort_by == "title":
            scored_docs.sort(key=lambda x: x["title"])
        elif sort_by == "words":
            scored_docs.sort(key=lambda x: x["word_count"], reverse=True)

        # Assign ranking positions
        for rank, item in enumerate(scored_docs, start=1):
            item["rank"] = rank

        total_matches = len(scored_docs)
        if top_k is not None and top_k > 0:
            scored_docs = scored_docs[:top_k]

        exec_time = round((time.perf_counter() - start_time) * 1000, 2)

        return {
            "query": query,
            "execution_time_ms": exec_time,
            "total_results": total_matches,
            "results": scored_docs,
            "query_terms": query_tokens,
            "query_term_details": query_term_details,
            "query_norm": round(q_norm, 4)
        }

    def _generate_snippet(self, content: str, query_raw: str, matched_stems: List[str]) -> str:
        """
        Creates a contextual preview snippet highlighting matching query words with <mark>.
        """
        sentences = re.split(r'(?<=[.!?]) +', content)
        best_sentence = sentences[0] if sentences else content[:200]
        max_matches = -1

        query_words = set(query_raw.lower().split())

        for s in sentences:
            s_lower = s.lower()
            matches = sum(1 for w in query_words if w in s_lower)
            if matches > max_matches:
                max_matches = matches
                best_sentence = s

        # Highlight query words in snippet
        highlighted = best_sentence
        for w in query_words:
            if len(w) > 2:
                pattern = re.compile(re.escape(w), re.IGNORECASE)
                highlighted = pattern.sub(lambda m: f"<mark>{m.group(0)}</mark>", highlighted)

        if len(highlighted) > 280:
            highlighted = highlighted[:275] + "..."
            
        return highlighted

    def get_live_search_trace(self, query: str) -> Dict[str, Any]:
        """
        Calculates and returns the step-by-step mathematical demonstration trace for a live search.
        """
        # Step 1: Receiving query
        step1 = {
            "step": 1,
            "title": "Query Acquisition",
            "description": "The search engine accepts the raw user search query string.",
            "data": {
                "raw_query": query,
                "character_length": len(query),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
        }

        # Step 2: Preprocessing query
        pipeline_res = run_pipeline(query)
        clean_tokens = clean_and_tokenize(query)
        step2 = {
            "step": 2,
            "title": "Linguistic Preprocessing",
            "description": "Applies lowercase conversion, tokenization, punctuation removal, stopword filtering, and Porter stemming.",
            "data": {
                "token_sequence": clean_tokens,
                "token_count": len(clean_tokens),
                "stages_applied": ["Lowercase", "Tokenize", "Punctuation Stripping", "Stopword Filtering", "Porter Stemming"]
            }
        }

        # Step 3: Inverted Index Lookup
        postings_found = {}
        candidate_docs_set = set()
        for token in clean_tokens:
            entry = global_index.search_term(token)
            if entry:
                postings_found[token] = {
                    "df": entry["df"],
                    "matching_docs": entry["matching_docs"]
                }
                candidate_docs_set.update(entry["matching_docs"])
            else:
                postings_found[token] = {
                    "df": 0,
                    "matching_docs": []
                }

        step3 = {
            "step": 3,
            "title": "Inverted Index Intersect & Lookup",
            "description": "Queries the inverted index dictionary to retrieve posting lists for each processed token.",
            "data": {
                "queried_terms": postings_found,
                "candidate_documents": sorted(list(candidate_docs_set)),
                "candidate_count": len(candidate_docs_set)
            }
        }

        # Step 4: Generating TF-IDF query vector
        V = len(self.vocabulary)
        q_vec = [0.0] * V
        q_counts = Counter(clean_tokens)
        q_term_breakdown = []
        for t, cnt in q_counts.items():
            if t in self.vocab_index:
                idx = self.vocab_index[t]
                tf = cnt / max(1, len(clean_tokens))
                idf = self.idf_dict.get(t, 1.0)
                tfidf = tf * idf
                q_vec[idx] = tfidf
                q_term_breakdown.append({
                    "term": t,
                    "tf": round(tf, 4),
                    "idf": round(idf, 4),
                    "tfidf": round(tfidf, 4)
                })

        q_norm = _vector_norm(q_vec)
        if q_norm == 0:
            q_norm = 1.0

        step4 = {
            "step": 4,
            "title": "TF-IDF Query Vector Generation",
            "description": "Transforms lexical tokens into a continuous mathematical vector in vocabulary space using TF * IDF weighting.",
            "data": {
                "vocabulary_dimension": V,
                "non_zero_components": len(q_term_breakdown),
                "terms_breakdown": q_term_breakdown,
                "query_vector_norm": round(q_norm, 4)
            }
        }

        # Step 5: Calculating Cosine Similarity
        similarity_details = []
        for doc in self.documents:
            doc_id = doc["doc_id"]
            d_vec = self.doc_vectors.get(doc_id)
            if d_vec is None:
                continue

            dot_prod = _dot_product(q_vec, d_vec)
            d_norm = self.doc_norms.get(doc_id, 1.0)
            sim = dot_prod / (q_norm * d_norm) if (dot_prod > 0 and d_norm > 0) else 0.0

            if sim > 0:
                similarity_details.append({
                    "doc_id": doc_id,
                    "title": doc["title"],
                    "dot_product": round(dot_prod, 5),
                    "query_norm": round(q_norm, 4),
                    "doc_norm": round(d_norm, 4),
                    "formula": f"({round(dot_prod, 4)}) / ({round(q_norm, 4)} * {round(d_norm, 4)})",
                    "similarity_score": round(sim, 4),
                    "similarity_pct": round(sim * 100, 1)
                })

        similarity_details.sort(key=lambda x: x["similarity_score"], reverse=True)

        step5 = {
            "step": 5,
            "title": "Vector Space Cosine Similarity Evaluation",
            "description": "Computes normalized inner product between query vector Q and document vectors D: cos(θ) = (Q · D) / (||Q|| × ||D||).",
            "data": {
                "formula_used": "Cosine Similarity = (Q · D) / (||Q|| × ||D||)",
                "evaluated_documents_count": len(self.documents),
                "matching_scored_count": len(similarity_details),
                "calculations": similarity_details[:8]
            }
        }

        # Step 6: Ranking Documents
        step6 = {
            "step": 6,
            "title": "Relevance Ranking & Scoring",
            "description": "Sorts candidate documents in strictly descending order of Cosine Similarity coefficients.",
            "data": {
                "top_ranked": [
                    {
                        "rank": idx + 1,
                        "doc_id": item["doc_id"],
                        "title": item["title"],
                        "score": item["similarity_score"],
                        "percentage": f"{item['similarity_pct']}%"
                    }
                    for idx, item in enumerate(similarity_details[:5])
                ]
            }
        }

        # Step 7: Final Result Generation
        search_res = self.search(query)
        step7 = {
            "step": 7,
            "title": "Result Snippet Formatting & Presentation",
            "description": "Generates contextual matched snippets with highlighted keywords and serves the final search response payload.",
            "data": {
                "total_results": search_res["total_results"],
                "execution_time_ms": search_res["execution_time_ms"],
                "results_preview": [
                    {
                        "rank": r["rank"],
                        "title": r["title"],
                        "doc_id": r["doc_id"],
                        "similarity_percentage": r["similarity_percentage"],
                        "matched_terms": r["matched_terms"]
                    }
                    for r in search_res["results"][:5]
                ]
            }
        }

        return {
            "query": query,
            "steps": [step1, step2, step3, step4, step5, step6, step7],
            "total_matches": len(similarity_details),
            "top_score": similarity_details[0]["similarity_score"] if similarity_details else 0.0
        }

    def get_tfidf_data(
        self,
        doc_id: Optional[str] = None,
        top_k_terms: int = 20,
        matrix_terms_count: int = 15,
        matrix_docs_count: int = 8,
        top_k: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Supplies detailed TF-IDF matrices, terms, and explanations for the TF-IDF Visualizer.
        """
        if top_k is not None:
            top_k_terms = top_k
        # Selected document top terms
        target_doc_id = doc_id
        if not target_doc_id and self.documents:
            target_doc_id = self.documents[0]["doc_id"]

        doc_top_terms = self.doc_tf_idf_terms.get(target_doc_id, [])[:top_k_terms]
        target_doc = self.doc_map.get(target_doc_id, {})

        # Build interactive matrix / heatmap of top informative terms across sample documents
        sample_docs = self.documents[:matrix_docs_count]
        
        # Pick terms that have highest average TF-IDF across collection
        term_tfidf_sum = Counter()
        for d_id, terms in self.doc_tf_idf_terms.items():
            for t in terms[:10]:
                term_tfidf_sum[t["term"]] += t["tfidf"]

        matrix_terms = [t for t, _ in term_tfidf_sum.most_common(matrix_terms_count)]
        if not matrix_terms and self.vocabulary:
            matrix_terms = self.vocabulary[:matrix_terms_count]

        # Construct heatmap rows: each doc with values for each term
        heatmap_matrix = []
        for d in sample_docs:
            d_id = d["doc_id"]
            d_terms_map = {t["term"]: t["tfidf"] for t in self.doc_tf_idf_terms.get(d_id, [])}
            row = {
                "doc_id": d_id,
                "title": d["title"][:28] + ("..." if len(d["title"]) > 28 else "")
            }
            for term in matrix_terms:
                row[term] = d_terms_map.get(term, 0.0)
            heatmap_matrix.append(row)

        return {
            "selected_doc": {
                "doc_id": target_doc.get("doc_id", ""),
                "title": target_doc.get("title", ""),
                "word_count": target_doc.get("word_count", 0),
                "unique_stems": len(self.doc_tf_idf_terms.get(target_doc_id, []))
            },
            "top_terms_for_selected": doc_top_terms,
            "matrix_terms": matrix_terms,
            "heatmap_data": heatmap_matrix,
            "vocabulary_size": len(self.vocabulary),
            "total_documents": len(self.documents),
            "sample_vocabulary": [
                {
                    "term": t,
                    "idf": round(self.idf_dict.get(t, 0.0), 4),
                    "df": global_index.index.get(t, {}).get("df", 0)
                }
                for t in self.vocabulary[:30]
            ],
            "explanation": {
                "what_is_tfidf": "TF-IDF (Term Frequency - Inverse Document Frequency) is a numerical statistic reflecting how important a word is to a document in a collection or corpus.",
                "tf_formula": "TF(t, d) = count(t, d) / total_words(d)",
                "idf_formula": "IDF(t) = ln((N + 1) / (DF(t) + 1)) + 1",
                "tfidf_formula": "TF-IDF(t, d) = TF(t, d) * IDF(t)",
                "interpretation": "High weight is achieved by high term frequency in the given document and low document frequency across the entire corpus, filtering out common words."
            }
        }

    def analyze_similarity(self, query: str, top_k: int = 5) -> Dict[str, Any]:
        """
        Supplies detailed vector comparison, formula breakdown, and rankings for the Similarity Analyzer.
        """
        search_res = self.search(query)
        top_results = search_res["results"][:top_k]
        
        query_terms = search_res["query_terms"]
        q_norm = search_res.get("query_norm", 1.0)

        comparisons = []
        for r in top_results:
            comparisons.append({
                "doc_id": r["doc_id"],
                "title": r["title"],
                "category": r["category"],
                "similarity_score": r["similarity_score"],
                "similarity_percentage": r["similarity_percentage"],
                "dot_product": r["dot_product"],
                "doc_norm": r["doc_norm"],
                "query_norm": q_norm,
                "matched_terms": r["matched_terms"],
                "breakdown": {
                    "numerator_dot_product": r["dot_product"],
                    "denominator_product": round(q_norm * r["doc_norm"], 4),
                    "cosine_formula": f"{r['dot_product']} / ({q_norm} × {r['doc_norm']}) = {r['similarity_score']}"
                }
            })

        return {
            "query": query,
            "query_terms": query_terms,
            "query_norm": q_norm,
            "top_comparisons": comparisons,
            "formula_info": {
                "name": "Cosine Similarity Formula",
                "equation": "Cosine Similarity(A, B) = (A · B) / (||A|| × ||B||)",
                "explanation": "Calculates the cosine of the angle between two multi-dimensional vectors. A score of 1.0 represents collinearity (identical topical orientation), while 0.0 denotes orthogonality (no shared terms)."
            }
        }

# Global search engine singleton
global_search_engine = SearchEngine()
