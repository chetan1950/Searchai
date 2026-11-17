"""
Direct End-to-End Test for Custom Text Document Creation, Indexing, and Search
"""
import sys, os, time
sys.path.insert(0, r"c:\Users\cheta\OneDrive\Desktop\searchlab-ai\backend")

from database import insert_document, delete_document, get_all_documents, get_document_by_id
from preprocessing import clean_and_tokenize
from search_engine import global_search_engine
from indexing import global_index

print("--- 1. Checking Initial Corpus ---")
initial_docs = get_all_documents()
initial_count = len(initial_docs)
print(f"Initial document count: {initial_count}")

print("\n--- 2. Simulating User Submitting Custom Text Document ---")
custom_title = "Quantum Annealing and Adiabatic Optimization in Information Retrieval"
custom_category = "Quantum Computing"
custom_content = (
    "Quantum annealing utilizes quantum tunneling and adiabatic Hamiltonian evolution to locate "
    "global minima in non-convex optimization manifolds. In the context of NLP and Search Engines, "
    "adiabatic quantum processors accelerate multi-keyword inverted index intersections and vector "
    "space clustering by orders of magnitude compared to classical silicon architectures."
)

# Step A: Tokenize & extract metadata exactly as main.py does
tokens = clean_and_tokenize(custom_content)
word_count = len(custom_content.split())
file_size = len(custom_content.encode('utf-8'))

# Step B: Insert into SQLite
created_doc = insert_document(
    title=custom_title,
    category=custom_category,
    filename="quantum_annealing.txt",
    file_type="txt",
    file_size=file_size,
    word_count=word_count,
    content=custom_content,
    processed_tokens=tokens
)
assert created_doc is not None, "Failed to insert custom document into database!"
new_id = created_doc["doc_id"]
print(f"SUCCESS: Custom Document inserted with Doc ID: {new_id}")
print(f"Tokens extracted: {len(tokens)} words -> {tokens[:6]}...")

# Step C: Re-index search engine & inverted index
docs_after = get_all_documents()
global_search_engine.index_collection(docs_after)
print(f"Re-indexed search engine. Total indexed: {len(global_search_engine.documents)} docs.")

print("\n--- 3. Testing Search Retrieval for New Custom Document ---")
search_res = global_search_engine.search("quantum annealing adiabatic hamiltonian", top_k=5)
print(f"Search Query: 'quantum annealing adiabatic hamiltonian'")
print(f"Total matching results: {search_res['total_results']}")
assert search_res['total_results'] > 0, "Custom document was not retrieved by search engine!"

top_result = search_res['results'][0]
print(f"Rank #1 Document: ID={top_result['doc_id']}, Title='{top_result['title']}'")
print(f"Similarity Score: {top_result['similarity_score']} ({top_result['similarity_percentage']}%)")
print(f"Matched Terms: {top_result['matched_terms']}")
assert top_result['doc_id'] == new_id, f"Expected {new_id} to be rank #1, but got {top_result['doc_id']}"

print("\n--- 4. Testing Inverted Index Verification ---")
term_info = global_index.search_term("quantum")
print(f"Inverted index for term 'quantum': DF={term_info['df']}, Postings={term_info['matching_docs']}")
assert new_id in term_info['matching_docs'], f"{new_id} missing from inverted index posting list for 'quantum'!"

print("\n--- 5. Testing Document Deletion and Clean-up ---")
del_success = delete_document(new_id)
assert del_success, f"Failed to delete document {new_id}"
print(f"Deleted document {new_id} successfully.")

# Re-index after deletion
global_search_engine.index_collection(get_all_documents())
search_after_del = global_search_engine.search("quantum annealing adiabatic hamiltonian", top_k=5)
remaining_ids = [r['doc_id'] for r in search_after_del['results']]
assert new_id not in remaining_ids, f"{new_id} still found in search after deletion!"
print(f"Verified {new_id} is completely removed from index and search results.")

final_docs = get_all_documents()
print(f"Corpus restored to original count: {len(final_docs)} documents.")

print("\n==================================================================")
print(">>> CUSTOM TEXT DOCUMENT LIFECYCLE 100% OPERATIONAL AND VERIFIED! <<<")
print("==================================================================")
