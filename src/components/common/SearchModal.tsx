import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Search as SearchIcon, X, Sparkles } from 'lucide-react';
import type { LifeReceipt } from '../../types/receipt';
import { formatCurrency, formatDatePretty } from '../../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { allReceipts, openEvidenceModal } = useData();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const sampleQueries = [
    'What happened on weekends?',
    'Show Starbucks transactions',
    'Show entertainment spending',
    'Late night Spotify listening',
    'Train commute and snacks',
  ];

  // Perform client-side intent & keyword match
  const results: LifeReceipt[] = query.trim() === '' ? [] : allReceipts.filter(r => {
    const q = query.toLowerCase();
    const titleMatch = (r.title || '').toLowerCase().includes(q);
    const categoryMatch = (r.category || '').toLowerCase().includes(q);
    const subtitleMatch = (r.subtitle || '').toLowerCase().includes(q);
    const tagMatch = r.tags.some(t => t.toLowerCase().includes(q));

    if (q.includes('weekend')) {
      return r.dayOfWeek === 0 || r.dayOfWeek === 6;
    }
    if (q.includes('late night') || q.includes('night')) {
      return r.hour >= 21 || r.hour <= 4;
    }

    return titleMatch || categoryMatch || subtitleMatch || tagMatch;
  }).slice(0, 30);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface border border-surfaceBorder rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-surfaceBorder flex items-center gap-3 bg-surface/80">
          <SearchIcon className="w-5 h-5 text-accentCyan" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something about your life in receipts..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm font-sans"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1 bg-surfaceHover rounded-lg text-xs text-gray-400 hover:text-white">
            ESC
          </button>
        </div>

        {/* Quick Sample Queries */}
        {query.trim() === '' && (
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-accentYellow" />
              <span>Suggested Intent Queries</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map(sq => (
                <button
                  key={sq}
                  onClick={() => setQuery(sq)}
                  className="px-3 py-1.5 rounded-xl bg-surfaceHover border border-surfaceBorder text-xs text-gray-300 hover:text-white hover:border-gray-600 transition-all"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query.trim() !== '' && (
          <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Found {results.length} matching records</span>
              {results.length > 0 && (
                <button
                  onClick={() => {
                    openEvidenceModal(`Search: "${query}"`, results);
                    onClose();
                  }}
                  className="text-accentCyan hover:underline font-mono"
                >
                  View All as Evidence Drawer
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No matching records found for "{query}". Try searching for categories, dates, or keywords.
              </div>
            ) : (
              results.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    openEvidenceModal(`Record Detail: ${r.title}`, [r]);
                    onClose();
                  }}
                  className="p-3 bg-surfaceHover/50 border border-surfaceBorder rounded-xl hover:border-accentCyan/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface border border-surfaceBorder text-gray-300">
                        {r.sourceLabel}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {formatDatePretty(r.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">{r.title}</div>
                    <div className="text-xs text-gray-400">{r.subtitle}</div>
                  </div>

                  {r.amount !== undefined && r.amount > 0 && (
                    <div className="text-right font-mono font-bold text-accentFinance text-sm">
                      {formatCurrency(r.amount, r.currency)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
