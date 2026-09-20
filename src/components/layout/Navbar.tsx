import React from 'react';
import { DataHealthBar } from './DataHealthBar';
import { Compass, Sparkles, Search as SearchIcon, CircleDollarSign, Music, Share2, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSearch: () => void;
  triggerFindInteresting: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSearch,
  triggerFindInteresting,
}) => {
  const navItems = [
    { id: 'overview', label: 'Observatory', icon: Compass },
    { id: 'money', label: 'Money', icon: CircleDollarSign },
    { id: 'soundtrack', label: 'Soundtrack', icon: Music },
    { id: 'connections', label: 'Connections', icon: Share2 },
    { id: 'chapters', label: 'Chapters', icon: BookOpen },
    { id: 'story', label: 'Story', icon: Layers },
  ];

  return (
    <>
      {/* Desktop Vertical Left Sidebar */}
      <aside className="hidden md:flex w-64 fixed top-0 bottom-0 left-0 z-40 bg-surface/80 backdrop-blur-xl border-r border-surfaceBorder flex-col justify-between p-4">
        
        {/* Top Header & Logo */}
        <div className="space-y-6">
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-surfaceHover/50 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accentFinance to-accentMusic p-0.5 shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-tr from-accentFinance to-accentMusic text-base">
                  R
                </span>
              </div>
            </div>
            <div>
              <span className="font-serif text-base font-bold tracking-tight text-white block leading-tight">
                LIFE IN RECEIPTS
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block mt-0.5">
                Financial Soundtrack
              </span>
            </div>
          </div>

          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surfaceHover/60 hover:bg-surfaceHover border border-surfaceBorder text-gray-400 hover:text-white text-xs transition-all"
          >
            <SearchIcon className="w-4 h-4 text-accentCyan" />
            <span className="flex-1 text-left font-sans">Search records...</span>
            <span className="px-1.5 py-0.5 rounded bg-surface border border-surfaceBorder text-[10px] font-mono text-gray-500">⌘K</span>
          </button>

          {/* Vertical Navigation Menu */}
          <nav className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-gray-500">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-accentFinance/20 to-accentMusic/20 text-white border border-accentFinance/30 shadow-md font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-surfaceHover/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accentFinance' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions & Data Health */}
        <div className="space-y-3 pt-4 border-t border-surfaceBorder/60">
          <button
            onClick={triggerFindInteresting}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-accentMusic/20 to-accentFinance/20 hover:from-accentMusic/30 hover:to-accentFinance/30 border border-accentMusic/40 text-xs font-medium text-purple-200 transition-all shadow-md group"
          >
            <Sparkles className="w-4 h-4 text-accentMusic group-hover:rotate-12 transition-transform" />
            <span>Find Something</span>
          </button>

          <div className="pt-1">
            <DataHealthBar />
          </div>
        </div>

      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-surfaceBorder px-4 h-14 flex items-center justify-between">
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accentFinance to-accentMusic p-0.5">
            <div className="w-full h-full bg-background rounded-[6px] flex items-center justify-center">
              <span className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-tr from-accentFinance to-accentMusic text-xs">
                R
              </span>
            </div>
          </div>
          <span className="font-serif text-sm font-bold text-white">
            LIFE IN RECEIPTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerFindInteresting}
            className="p-1.5 rounded-lg bg-surface border border-accentMusic/40 text-purple-300"
          >
            <Sparkles className="w-4 h-4 text-accentMusic" />
          </button>

          <button
            onClick={openSearch}
            className="p-1.5 rounded-lg bg-surface border border-surfaceBorder text-gray-300"
          >
            <SearchIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-lg border-t border-surfaceBorder px-2 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium transition-all ${
                isActive ? 'text-accentFinance font-bold' : 'text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
