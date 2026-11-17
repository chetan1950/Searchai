import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Cpu,
  Layers,
  Database,
  BarChart3,
  Network,
  Info,
  Play,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Binary
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  indexedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  indexedCount = 18
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'search', label: 'Explore Search', icon: Search },
    { id: 'live-demo', label: 'Live Demo', icon: Play, badge: '7-Step' },
    { id: 'documents', label: 'Doc Explorer', icon: BookOpen },
    { id: 'nlp', label: 'NLP Playground', icon: Sparkles },
    { id: 'inverted-index', label: 'Inverted Index', icon: Binary },
    { id: 'tfidf', label: 'TF-IDF Lab', icon: Layers },
    { id: 'similarity', label: 'Similarity', icon: Cpu },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'about', label: 'About & Docs', icon: Info },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-2xl transition-all duration-300 border-b ${
        isDark
          ? 'bg-slate-950/90 border-cyan-500/20 shadow-lg shadow-black/40 text-slate-100'
          : 'bg-white/90 border-slate-200/90 shadow-md shadow-indigo-100/40 text-slate-800'
      }`}
    >
      {/* Extended Width & Height (Top bar length increased) */}
      <div className="max-w-[1620px] w-full mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center transition-colors ${
                  isDark ? 'bg-slate-950' : 'bg-white'
                }`}
              >
                <Database className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  SearchLab AI
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    isDark
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  IR · NLP LAB
                </span>
              </div>
              <p
                className={`text-[11px] hidden sm:block tracking-wide ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Information Retrieval &amp; Search Engine Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Spacious & Modern) */}
          <div className="hidden xl:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? isDark
                        ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                        : 'text-indigo-700 bg-indigo-50/90 border border-indigo-200/90 shadow-sm shadow-indigo-100 font-bold'
                      : isDark
                      ? 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60 border border-transparent'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/90 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                      isActive
                        ? isDark
                          ? 'text-cyan-400'
                          : 'text-indigo-600'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.5 text-[9px] font-extrabold rounded-md border ${
                        isDark
                          ? 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                          : 'bg-purple-100 text-purple-700 border-purple-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full ${
                        isDark
                          ? 'bg-gradient-to-r from-cyan-400 to-purple-400'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Corpus Live Status & Stylish Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live Corpus Pill */}
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-800 shadow-sm'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] font-semibold">
                {indexedCount} Docs Ready
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Stylish Light Theme' : 'Switch to Dark Laboratory Theme'}
              className={`p-2.5 rounded-2xl border transition-all duration-200 flex items-center justify-center ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-sm hover:shadow-md'
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-2.5 rounded-2xl border ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-cyan-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-indigo-600 shadow-sm'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`xl:hidden border-b px-4 pt-2 pb-5 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top duration-200 ${
            isDark ? 'bg-slate-950/95 border-cyan-500/20' : 'bg-white/98 border-slate-200 shadow-xl'
          }`}
        >
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? isDark
                        ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-500/40'
                        : 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? isDark
                          ? 'text-cyan-400'
                          : 'text-indigo-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] text-purple-600 dark:text-purple-300 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
