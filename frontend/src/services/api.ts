// SearchLab AI - Frontend API Service
import axios from 'axios';
import type {
  DashboardResponse,
  SearchResponse,
  PreprocessingResponse,
  InvertedIndexResponse,
  TfidfResponse,
  SimilarityResponse,
  ArchitectureComponent,
  DemonstrationTraceResponse,
  DocumentItem,
  SearchHistoryItem
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchDashboard = async (): Promise<DashboardResponse> => {
  const res = await api.get('/dashboard');
  return res.data;
};

export const executeSearch = async (
  query: string,
  categoryFilter: string = 'all',
  minScore: number = 0.0,
  sortBy: string = 'relevance'
): Promise<SearchResponse> => {
  const res = await api.post('/search', {
    query,
    category_filter: categoryFilter,
    min_score: minScore,
    sort_by: sortBy
  });
  return res.data;
};

export const fetchSearchSuggestions = async (query: string): Promise<{
  query: string;
  term_suggestions: string[];
  title_suggestions: string[];
}> => {
  const res = await api.get('/search/suggestions', { params: { q: query } });
  return res.data;
};

export const fetchSearchHistory = async (): Promise<SearchHistoryItem[]> => {
  const res = await api.get('/search/history');
  return res.data.history || [];
};

export const clearHistory = async (): Promise<void> => {
  await api.delete('/search/history');
};

export const fetchLiveTrace = async (query: string): Promise<DemonstrationTraceResponse> => {
  const res = await api.post('/search/trace', { query });
  return res.data;
};

export const fetchDocuments = async (): Promise<{
  total_documents: number;
  categories: string[];
  documents: DocumentItem[];
}> => {
  const res = await api.get('/documents');
  return res.data;
};

export const fetchSingleDocument = async (docId: string): Promise<{
  document: DocumentItem;
  top_tfidf_terms: Array<{
    term: string;
    raw_tf: number;
    tf: number;
    idf: number;
    tfidf: number;
  }>;
}> => {
  const res = await api.get(`/documents/${docId}`);
  return res.data;
};

export const createCustomDocument = async (
  title: string,
  category: string,
  content: string
): Promise<{ status: string; message: string; document: DocumentItem }> => {
  const res = await api.post('/documents', { title, category, content });
  return res.data;
};

export const uploadDocumentFile = async (
  file: File,
  title?: string,
  category?: string
): Promise<{ status: string; message: string; document: DocumentItem }> => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (category) formData.append('category', category);

  const res = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteDocument = async (docId: string): Promise<{ status: string; message: string }> => {
  const res = await api.delete(`/documents/${docId}`);
  return res.data;
};

export const resetSampleDocuments = async (): Promise<{ status: string; message: string }> => {
  const res = await api.post('/documents/reset-samples');
  return res.data;
};

export const runPreprocess = async (text: string): Promise<PreprocessingResponse> => {
  const res = await api.post('/preprocess', { text });
  return res.data;
};

export const fetchInvertedIndex = async (
  q?: string,
  sortBy: string = 'df',
  page: number = 1,
  pageSize: number = 40
): Promise<InvertedIndexResponse> => {
  const res = await api.get('/inverted-index', {
    params: { q, sort_by: sortBy, page, page_size: pageSize }
  });
  return res.data;
};

export const fetchTfidfData = async (
  docId?: string,
  topK: number = 20,
  matrixTerms: number = 12,
  matrixDocs: number = 8
): Promise<TfidfResponse> => {
  const res = await api.get('/tfidf', {
    params: {
      doc_id: docId,
      top_k: topK,
      matrix_terms: matrixTerms,
      matrix_docs: matrixDocs
    }
  });
  return res.data;
};

export const runSimilarityAnalysis = async (
  query: string,
  topK: number = 5
): Promise<SimilarityResponse> => {
  const res = await api.post('/similarity', { query, top_k: topK });
  return res.data;
};

export const fetchArchitecture = async (): Promise<ArchitectureComponent[]> => {
  const res = await api.get('/architecture');
  return res.data.components || [];
};

export const fetchAnalytics = async (): Promise<any> => {
  const res = await api.get('/analytics');
  return res.data;
};
