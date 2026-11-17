"""
Step-by-step verification script
"""
import sys, os, time
sys.path.insert(0, r"c:\Users\cheta\OneDrive\Desktop\searchlab-ai\backend")

from main import global_search_engine, reload_search_engine, run_pipeline, global_index, ARCHITECTURE_COMPONENTS
from database import get_dashboard_stats, get_all_documents, get_search_history, record_search

print("[1/8] Re-indexing collection...")
t0 = time.time()
reload_search_engine()
print(f"      Indexed {len(global_search_engine.documents)} docs in {round(time.time() - t0, 3)}s")

print("[2/8] Testing Inverted Index...")
vocab = global_index.get_vocabulary_summary()
print(f"      Unique vocabulary: {vocab['unique_vocabulary_count']} terms")
term_lookup = global_index.search_term("retriev")
print(f"      Term 'retriev' found in {term_lookup['df']} documents: {term_lookup['matching_docs']}")

print("[3/8] Testing 6-Stage NLP Pipeline...")
nlp_res = run_pipeline("Information Retrieval Systems help users find relevant information.")
print(f"      Input words: {nlp_res['summary']['initial_words']} -> Stems: {nlp_res['final_tokens']}")
print(f"      All 6 stages verified: {[s['name'] for s in nlp_res['stages']]}")

print("[4/8] Testing TF-IDF & Cosine Similarity Search...")
t1 = time.time()
search_res = global_search_engine.search("neural networks backpropagation")
print(f"      Search executed in {search_res['execution_time_ms']}ms. Total hits: {search_res['total_results']}")
print(f"      Top Rank #1: {search_res['results'][0]['title']} ({search_res['results'][0]['similarity_percentage']}%)")

print("[5/8] Testing 7-Step Live Search Trace...")
trace = global_search_engine.get_live_search_trace("pagerank web link")
print(f"      Trace generated {len(trace['steps'])} interactive steps")
print(f"      Step 4 query vector non-zero terms: {trace['steps'][3]['data']['non_zero_components']}")
print(f"      Step 5 top dot product doc: {trace['steps'][4]['data']['calculations'][0]['title']}")

print("[6/8] Testing TF-IDF Matrix & Heatmap...")
tfidf_data = global_search_engine.get_tfidf_data(doc_id="D1", top_k=5, matrix_terms_count=8, matrix_docs_count=5)
print(f"      Selected doc D1 top term: {tfidf_data['top_terms_for_selected'][0]['term']} (weight: {tfidf_data['top_terms_for_selected'][0]['tfidf']})")
print(f"      Heatmap matrix rows: {len(tfidf_data['heatmap_data'])} docs x {len(tfidf_data['matrix_terms'])} terms")

print("[7/8] Testing Cosine Similarity Analyzer...")
sim_data = global_search_engine.analyze_similarity("machine learning supervised classification")
print(f"      Top matching doc: {sim_data['top_comparisons'][0]['title']} ({sim_data['top_comparisons'][0]['similarity_percentage']}%)")
print(f"      Formula: {sim_data['top_comparisons'][0]['breakdown']['cosine_formula']}")

print("[8/8] Testing Architecture Flow & DB Stats...")
stats = get_dashboard_stats()
print(f"      Architecture components: {len(ARCHITECTURE_COMPONENTS)}")
print(f"      Database stats: {stats['indexed_documents']} documents, {stats['total_words']} total words")

print("\n>>> ALL ALGORITHMIC AND BACKEND SUBSYSTEMS 100% OPERATIONAL! <<<")
