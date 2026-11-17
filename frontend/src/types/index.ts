// SearchLab AI - TypeScript Type Definitions

export interface DocumentItem {
  id: number;
  doc_id: string;
  title: string;
  category: string;
  filename: string;
  file_type: string;
  file_size: number;
  word_count: number;
  content: string;
  processed_tokens: string[];
  created_at: string;
  indexed_status: string;
}

export interface SearchResultItem {
  rank: number;
  doc_id: string;
  id: number;
  title: string;
  category: string;
  filename: string;
  word_count: number;
  similarity_score: number;
  similarity_percentage: number;
  dot_product: number;
  doc_norm: number;
  query_norm: number;
  matched_terms: string[];
  matched_terms_count: number;
  snippet: string;
}

export interface SearchResponse {
  query: string;
  execution_time_ms: number;
  total_results: number;
  results: SearchResultItem[];
  query_terms: string[];
  query_norm: number;
  query_term_details?: Array<{
    term: string;
    count: number;
    tf: number;
    idf: number;
    tfidf: number;
  }>;
}

export interface SearchHistoryItem {
  id: number;
  query: string;
  results_count: number;
  execution_time_ms: number;
  top_doc_title: string;
  top_similarity: number;
  searched_at: string;
}

export interface DashboardStats {
  indexed_documents: number;
  unique_vocabulary: number;
  total_tokens_indexed: number;
  search_operations: number;
  avg_search_time_ms: number;
  total_corpus_words: number;
}

export interface DashboardResponse {
  status: string;
  statistics: DashboardStats;
  category_distribution: Array<{ name: string; value: number }>;
  top_frequent_terms: Array<{ term: string; df: number; total_tf: number }>;
  recent_searches: SearchHistoryItem[];
}

export interface PreprocessingStage {
  stage_number: number;
  name: string;
  explanation: string;
  why: string;
  impact: string;
  data_type: 'string' | 'list';
  output: string | string[];
  removed_items?: string[];
  transformations?: Array<{ original: string; stemmed: string }>;
  metrics?: Record<string, any>;
}

export interface PreprocessingResponse {
  original_text: string;
  final_tokens: string[];
  stages: PreprocessingStage[];
  summary: {
    initial_words: number;
    final_tokens: number;
    unique_stems: number;
    noise_reduction_pct: number;
  };
}

export interface InvertedIndexPosting {
  doc_id: string;
  doc_title: string;
  tf: number;
  positions: number[];
}

export interface InvertedIndexRow {
  term: string;
  df: number;
  total_tf: number;
  posting_list: string[];
  detailed_postings: InvertedIndexPosting[];
}

export interface InvertedIndexResponse {
  total_terms: number;
  page: number;
  page_size: number;
  total_pages: number;
  rows: InvertedIndexRow[];
  summary: {
    total_documents: number;
    unique_vocabulary_count: number;
    total_tokens_indexed: number;
    average_document_length: number;
    top_terms_by_df: Array<{ term: string; df: number; total_tf: number }>;
    top_terms_by_tf: Array<{ term: string; df: number; total_tf: number }>;
  };
}

export interface TfidfTermItem {
  term: string;
  raw_tf: number;
  tf: number;
  idf: number;
  tfidf: number;
}

export interface TfidfResponse {
  selected_doc: {
    doc_id: string;
    title: string;
    word_count: number;
    unique_stems: number;
  };
  top_terms_for_selected: TfidfTermItem[];
  matrix_terms: string[];
  heatmap_data: Array<Record<string, any>>;
  vocabulary_size: number;
  total_documents: number;
  sample_vocabulary: Array<{ term: string; idf: number; df: number }>;
  explanation: {
    what_is_tfidf: string;
    tf_formula: string;
    idf_formula: string;
    tfidf_formula: string;
    interpretation: string;
  };
}

export interface SimilarityComparison {
  doc_id: string;
  title: string;
  category: string;
  similarity_score: number;
  similarity_percentage: number;
  dot_product: number;
  doc_norm: number;
  query_norm: number;
  matched_terms: string[];
  breakdown: {
    numerator_dot_product: number;
    denominator_product: number;
    cosine_formula: string;
  };
}

export interface SimilarityResponse {
  query: string;
  query_terms: string[];
  query_norm: number;
  top_comparisons: SimilarityComparison[];
  formula_info: {
    name: string;
    equation: string;
    explanation: string;
  };
}

export interface ArchitectureComponent {
  id: string;
  step_num: number;
  name: string;
  category: string;
  what: string;
  why: string;
  how: string;
  python_library: string;
}

export interface DemonstrationStep {
  step: number;
  title: string;
  description: string;
  data: Record<string, any>;
}

export interface DemonstrationTraceResponse {
  query: string;
  steps: DemonstrationStep[];
  total_matches: number;
  top_score: number;
}
