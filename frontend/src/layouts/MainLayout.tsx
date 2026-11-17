import React from 'react';
import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  indexedCount?: number;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  indexedCount = 18
}) => {
  return (
    <div
      className={`min-h-screen flex flex-col relative transition-colors duration-300 ${
        isDark ? 'bg-[#070b19] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Background Ambient Aesthetics */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      {isDark ? (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="fixed top-0 left-1/3 w-[600px] h-[400px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />
          <div className="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
        </>
      )}

      {/* Spacious Extended Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        indexedCount={indexedCount}
      />

      {/* Main Page Content Container */}
      <main className="flex-1 max-w-[1580px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
};
