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
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accentFinance to-accentMusic p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-background rounded-[7px] flex items-center justify-center">
              <span className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-tr from-accentFinance to-accentMusic text-sm">
                R
              </span>
            </div>
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-white block leading-none">
              LIFE IN RECEIPTS
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block mt-0.5">
              Financial Soundtrack
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 bg-surface/50 p-1 rounded-xl border border-surfaceBorder">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-accentFinance/20 to-accentMusic/20 text-white border border-white/10 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-surfaceHover'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accentFinance' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions & Health Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <DataHealthBar />
          </div>

          <button
            onClick={triggerFindInteresting}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accentMusic/20 to-accentFinance/20 hover:from-accentMusic/30 hover:to-accentFinance/30 border border-accentMusic/40 text-xs font-medium text-purple-200 transition-all shadow-md group"
          >
            <Sparkles className="w-3.5 h-3.5 text-accentMusic group-hover:rotate-12 transition-transform" />
            <span>Find Something</span>
          </button>

          <button
            onClick={openSearch}
            className="p-2 rounded-xl bg-surface hover:bg-surfaceHover border border-surfaceBorder text-gray-300 transition-all"
            title="Search Data"
          >
            <SearchIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-lg border-t border-surfaceBorder px-2 py-2 flex justify-around">
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
    </header>
  );
};
