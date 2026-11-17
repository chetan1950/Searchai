import React, { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { ToastContainer, type ToastMessage } from './components/Toast';

import { OverviewPage } from './pages/OverviewPage';
import { SearchPage } from './pages/SearchPage';
import { LiveDemoPage } from './pages/LiveDemoPage';
import { DocumentExplorerPage } from './pages/DocumentExplorerPage';
import { NlpPlaygroundPage } from './pages/NlpPlaygroundPage';
import { InvertedIndexPage } from './pages/InvertedIndexPage';
import { TfidfVisualizerPage } from './pages/TfidfVisualizerPage';
import { SimilarityAnalyzerPage } from './pages/SimilarityAnalyzerPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [activeTab, setActiveTab] = useState('overview');
  // Default to the stylish light modern theme requested by user
  const [isDark, setIsDark] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [demoQuery, setDemoQuery] = useState('information retrieval vector space');

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
      document.body.style.backgroundColor = '#070b19';
      document.body.style.color = '#f1f5f9';
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigateToDemo = (query: string) => {
    setDemoQuery(query);
    setActiveTab('live-demo');
  };

  const handleNavigateToSearch = (query: string) => {
    setActiveTab('search');
  };

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isDark={isDark}
      toggleTheme={toggleTheme}
      indexedCount={18}
    >
      {activeTab === 'overview' && (
        <OverviewPage onNavigate={(tab) => setActiveTab(tab)} />
      )}

      {activeTab === 'search' && (
        <SearchPage
          onNavigateToDemo={handleNavigateToDemo}
          onViewDocument={() => setActiveTab('documents')}
        />
      )}

      {activeTab === 'live-demo' && (
        <LiveDemoPage
          initialQuery={demoQuery}
          onNavigateToSearch={handleNavigateToSearch}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentExplorerPage onNotify={addToast} />
      )}

      {activeTab === 'nlp' && (
        <NlpPlaygroundPage />
      )}

      {activeTab === 'inverted-index' && (
        <InvertedIndexPage
          onViewDoc={() => setActiveTab('documents')}
        />
      )}

      {activeTab === 'tfidf' && (
        <TfidfVisualizerPage />
      )}

      {activeTab === 'similarity' && (
        <SimilarityAnalyzerPage
          onViewDoc={() => setActiveTab('documents')}
        />
      )}

      {activeTab === 'architecture' && (
        <ArchitecturePage />
      )}

      {activeTab === 'about' && (
        <AboutPage />
      )}

      {/* Global Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </MainLayout>
  );
}

export default App;
