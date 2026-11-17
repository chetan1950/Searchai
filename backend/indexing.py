"""
SearchLab AI - Inverted Index Engine
Constructs, manages, and queries the Inverted Index data structure for all indexed documents.
"""

from collections import defaultdict
from typing import Dict, List, Any, Optional

class InvertedIndex:
    def __init__(self):
        # term -> { "df": int, "total_tf": int, "postings": { doc_id: { "tf": int, "doc_title": str, "positions": [int] } } }
        self.index: Dict[str, Dict[str, Any]] = {}
        self.doc_lengths: Dict[str, int] = {}
        self.doc_titles: Dict[str, str] = {}
        self.total_docs: int = 0
        self.total_terms_count: int = 0

    def build_index(self, documents: List[Dict[str, Any]]):
        """
        Reconstructs the inverted index from a list of documents.
        Each document has: doc_id, title, processed_tokens
        """
        self.index.clear()
        self.doc_lengths.clear()
        self.doc_titles.clear()
        self.total_docs = len(documents)
        self.total_terms_count = 0

        raw_index = defaultdict(lambda: defaultdict(lambda: {"tf": 0, "positions": []}))

        for doc in documents:
            doc_id = doc["doc_id"]
            title = doc["title"]
            tokens = doc.get("processed_tokens", [])
            self.doc_lengths[doc_id] = len(tokens)
            self.doc_titles[doc_id] = title
            self.total_terms_count += len(tokens)

            for pos, token in enumerate(tokens):
                raw_index[token][doc_id]["tf"] += 1
                raw_index[token][doc_id]["positions"].append(pos)

        # Structure index with df, total_tf, and formatted postings
        for term, postings_dict in raw_index.items():
            postings_list = []
            total_tf = 0
            for doc_id, data in postings_dict.items():
                total_tf += data["tf"]
                postings_list.append({
                    "doc_id": doc_id,
                    "doc_title": self.doc_titles.get(doc_id, doc_id),
                    "tf": data["tf"],
                    "positions": data["positions"]
                })
            
            # Sort postings by doc_id
            postings_list.sort(key=lambda x: (len(x["doc_id"]), x["doc_id"]))

            self.index[term] = {
                "term": term,
                "df": len(postings_dict),
                "total_tf": total_tf,
                "postings": postings_list
            }

    def get_vocabulary_summary(self) -> Dict[str, Any]:
        """
        Returns high-level statistics of the inverted index.
        """
        unique_vocab = len(self.index)
        top_terms_by_df = sorted(
            [{"term": t, "df": d["df"], "total_tf": d["total_tf"]} for t, d in self.index.items()],
            key=lambda x: x["df"],
            reverse=True
        )[:15]

        top_terms_by_tf = sorted(
            [{"term": t, "df": d["df"], "total_tf": d["total_tf"]} for t, d in self.index.items()],
            key=lambda x: x["total_tf"],
            reverse=True
        )[:15]

        avg_doc_len = round(self.total_terms_count / max(1, self.total_docs), 1)

        return {
            "total_documents": self.total_docs,
            "unique_vocabulary_count": unique_vocab,
            "total_tokens_indexed": self.total_terms_count,
            "average_document_length": avg_doc_len,
            "top_terms_by_df": top_terms_by_df,
            "top_terms_by_tf": top_terms_by_tf
        }

    def search_term(self, query_term: str) -> Optional[Dict[str, Any]]:
        """
        Directly looks up a term in the inverted index.
        """
        term = query_term.lower().strip()
        if term in self.index:
            entry = self.index[term]
            return {
                "term": term,
                "df": entry["df"],
                "total_tf": entry["total_tf"],
                "postings": entry["postings"],
                "matching_docs": [p["doc_id"] for p in entry["postings"]]
            }
        return None

    def get_all_entries(
        self,
        search_filter: Optional[str] = None,
        sort_by: str = "df",
        page: int = 1,
        page_size: int = 50
    ) -> Dict[str, Any]:
        """
        Retrieves paginated, filtered inverted index rows.
        """
        terms = list(self.index.values())

        if search_filter:
            f = search_filter.lower().strip()
            terms = [t for t in terms if f in t["term"]]

        if sort_by == "df":
            terms.sort(key=lambda x: x["df"], reverse=True)
        elif sort_by == "tf":
            terms.sort(key=lambda x: x["total_tf"], reverse=True)
        elif sort_by == "alpha":
            terms.sort(key=lambda x: x["term"])

        total_count = len(terms)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated = terms[start_idx:end_idx]

        # Format rows for tabular visualizer
        rows = []
        for t in paginated:
            rows.append({
                "term": t["term"],
                "df": t["df"],
                "total_tf": t["total_tf"],
                "posting_list": [p["doc_id"] for p in t["postings"]],
                "detailed_postings": t["postings"]
            })

        return {
            "total_terms": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // max(1, page_size),
            "rows": rows
        }

# Global singleton
global_index = InvertedIndex()
