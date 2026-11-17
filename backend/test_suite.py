"""
SearchLab AI - Comprehensive Verification Test Suite
Directly invokes all FastAPI endpoint functions inside a single async event loop.
"""

import sys
import os
import asyncio
sys.path.insert(0, os.path.dirname(__file__))

from main import (
    get_dashboard, search_documents, get_live_search_trace,
    get_search_suggestions, list_documents, get_single_document,
    create_custom_document, remove_document, preprocess_text,
    get_inverted_index, get_tfidf_visualizer_data, analyze_cosine_similarity,
    get_architecture, get_analytics, seed_sample_documents_if_empty, reload_search_engine
)
from models import SearchRequest, PreprocessRequest, CustomDocumentRequest, SimilarityRequest, LiveTraceRequest

async def main():
    print("=" * 65)
    print("  SearchLab AI - Running Comprehensive Test Suite")
    print("=" * 65)
    
    seed_sample_documents_if_empty()
    reload_search_engine()
    
    passed = 0
    total = 0

    def assert_test(name, condition, extra=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  [PASS] {name} {extra}")
        else:
            print(f"  [FAIL] {name} {extra}")
            raise AssertionError(f"Test failed: {name}")

    # 1. Dashboard
    dash = await get_dashboard()
    assert_test("GET /api/dashboard", dash["status"] == "success" and dash["statistics"]["indexed_documents"] >= 16)

    # 2. Search
    search_req = SearchRequest(
        query="information retrieval vector space model",
        category_filter="all",
        min_score=0.0,
        sort_by="relevance"
    )
    search_res = await search_documents(search_req)
    assert_test(
        "POST /api/search",
        search_res["status"] == "success" and search_res["total_results"] > 0,
        f"(Hits: {search_res['total_results']}, Top: {search_res['results'][0]['title'][:30]})"
    )

    # 3. Live Trace Demonstration (7 Steps)
    trace_req = LiveTraceRequest(query="neural networks backpropagation")
    trace_res = await get_live_search_trace(trace_req)
    assert_test(
        "POST /api/search/trace (7 Steps)",
        trace_res["status"] == "success" and len(trace_res["steps"]) == 7,
        f"(Steps: {len(trace_res['steps'])}, Top score: {trace_res['top_score']})"
    )

    # 4. Search Suggestions
    sugg_res = await get_search_suggestions("retriev")
    assert_test("GET /api/search/suggestions", "retriev" in sugg_res["term_suggestions"])

    # 5. Documents Listing
    docs_res = await list_documents()
    assert_test("GET /api/documents", len(docs_res["documents"]) >= 16)

    # 6. Single Document
    doc_res = await get_single_document("D1")
    assert_test("GET /api/documents/D1", doc_res["status"] == "success" and "document" in doc_res)

    # 7. NLP 6-Stage Preprocessing Pipeline
    prep_req = PreprocessRequest(text="Information Retrieval Systems help users find relevant information.")
    prep_res = await preprocess_text(prep_req)
    assert_test("POST /api/preprocess (6 Stages)", prep_res["status"] == "success" and len(prep_res["stages"]) == 6)

    # 8. Inverted Index Lab
    inv_res = await get_inverted_index(q="learn", sort_by="df", page=1, page_size=20)
    assert_test("GET /api/inverted-index", inv_res["status"] == "success" and len(inv_res["rows"]) > 0)

    # 9. TF-IDF Visualizer
    tfidf_res = await get_tfidf_visualizer_data(doc_id="D1", top_k=20, matrix_terms=12, matrix_docs=8)
    assert_test("GET /api/tfidf", tfidf_res["status"] == "success" and len(tfidf_res["top_terms_for_selected"]) > 0)

    # 10. Cosine Similarity Analyzer
    sim_req = SimilarityRequest(query="machine learning supervised classification", top_k=5)
    sim_res = await analyze_cosine_similarity(sim_req)
    assert_test("POST /api/similarity", sim_res["status"] == "success" and len(sim_res["top_comparisons"]) > 0)

    # 11. Architecture Components (9 Components)
    arch_res = await get_architecture()
    assert_test("GET /api/architecture (9 Components)", len(arch_res["components"]) == 9)

    # 12. Create & Delete Custom Document
    create_req = CustomDocumentRequest(
        title="Quantum Computing & Entanglement",
        category="Quantum",
        content="Quantum algorithms utilize qubits, superposition, and quantum entanglement to execute polynomial-time factoring."
    )
    create_res = await create_custom_document(create_req)
    new_doc_id = create_res["document"]["doc_id"]
    assert_test("POST /api/documents (Create)", create_res["status"] == "success" and new_doc_id.startswith("D"))

    # Verify searchable immediately
    verify_search = await search_documents(SearchRequest(query="quantum superposition qubits"))
    assert_test("Search Newly Added Document", verify_search["results"][0]["doc_id"] == new_doc_id)

    # Delete custom document
    del_res = await remove_document(new_doc_id)
    assert_test(f"DELETE /api/documents/{new_doc_id}", del_res["status"] == "success")

    # 13. System Analytics
    analytics_res = await get_analytics()
    assert_test("GET /api/analytics", analytics_res["status"] == "success")

    # 14. Check compiled frontend dist files
    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "index.html"))
    assert_test("Frontend Production Build Exists", os.path.exists(frontend_dist))

    print("=" * 65)
    print(f"  ALL {passed}/{total} VERIFICATION TESTS PASSED SUCCESSFULLY (100%)!")
    print("=" * 65)

if __name__ == "__main__":
    asyncio.run(main())
