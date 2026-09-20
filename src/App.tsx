import React, { useState } from 'react';
import { DataProvider, useData } from './hooks/useData';
import { Navbar } from './components/layout/Navbar';
import { EvidenceModal } from './components/common/EvidenceModal';
import { SearchModal } from './components/common/SearchModal';

import { Home } from './pages/Home';
import { Overview } from './pages/Overview';
import { Money } from './pages/Money';
import { Soundtrack } from './pages/Soundtrack';
import { Connections } from './pages/Connections';
import { Chapters } from './pages/Chapters';
import { Story } from './pages/Story';

import { AlertTriangle, Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { loading, errorMsg, patterns, openEvidenceModal } = useData();

  const handleFindInteresting = () => {
    if (patterns.length > 0) {
      const topPattern = patterns[0];
      openEvidenceModal(`Discovery: ${topPattern.title}`, topPattern.supportingReceipts);
    } else {
      setActiveTab('connections');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-surfaceBorder flex items-center justify-center shadow-2xl">
          <Loader2 className="w-8 h-8 text-accentMusic animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-white">Reading Your Life Receipts...</h2>
          <p className="text-xs text-gray-400 font-mono">Parsing 100% real CSV datasets & computing co-occurrence scores</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-serif font-bold text-white">Dataset Unavailable</h2>
          <p className="text-xs text-gray-400">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSearch={() => setIsSearchOpen(true)}
        triggerFindInteresting={handleFindInteresting}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} triggerFindInteresting={handleFindInteresting} />}
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'money' && <Money />}
        {activeTab === 'soundtrack' && <Soundtrack />}
        {activeTab === 'connections' && <Connections />}
        {activeTab === 'chapters' && <Chapters />}
        {activeTab === 'story' && <Story />}
      </main>

      <EvidenceModal />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
