import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { X, FileText, Calendar, Tag, MapPin, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDatePretty } from '../../utils/formatters';

export const EvidenceModal: React.FC = () => {
  const { activeEvidenceReceipts, activeEvidenceTitle, closeEvidenceModal } = useData();
  const [selectedRawIndex, setSelectedRawIndex] = useState<number | null>(null);

  if (!activeEvidenceReceipts || activeEvidenceReceipts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface border border-surfaceBorder rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-surfaceBorder flex items-center justify-between bg-surface/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accentCyan mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Empirical Data Evidence</span>
            </div>
            <h3 className="text-xl font-bold text-white font-serif">
              {activeEvidenceTitle || 'Supporting Records'}
            </h3>
          </div>
          <button
            onClick={closeEvidenceModal}
            className="p-2 rounded-xl bg-surfaceHover hover:bg-surfaceBorder text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {activeEvidenceReceipts.map((receipt, idx) => {
            const isFinance = receipt.source === 'finance';
            const isSpotify = receipt.source === 'spotify';

            const badgeBg = isFinance
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
              : isSpotify
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

            const showRaw = selectedRawIndex === idx;

            return (
              <div
                key={receipt.id + '_' + idx}
                className="bg-surfaceHover/50 border border-surfaceBorder rounded-xl p-4 transition-all hover:border-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${badgeBg}`}>
                        {receipt.sourceLabel}
                      </span>
                      <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {formatDatePretty(receipt.timestamp)} at {receipt.timeStr}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-white">
                      {receipt.title}
                    </h4>

                    {receipt.subtitle && (
                      <p className="text-xs text-gray-400">
                        {receipt.subtitle}
                      </p>
                    )}

                    {receipt.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{receipt.location}</span>
                      </div>
                    )}
                  </div>

                  {receipt.amount !== undefined && receipt.amount > 0 && (
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-accentFinance">
                        {formatCurrency(receipt.amount, receipt.currency || '₹')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mt-3 flex items-center justify-between border-t border-surfaceBorder/50 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-gray-500" />
                    {receipt.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-surface/80 text-[10px] text-gray-400">
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedRawIndex(showRaw ? null : idx)}
                    className="flex items-center gap-1 text-[11px] text-accentCyan hover:underline font-mono"
                  >
                    <span>{showRaw ? 'Hide Raw Fields' : 'Inspect Raw Metadata'}</span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${showRaw ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Raw JSON viewer */}
                {showRaw && (
                  <div className="mt-3 p-3 bg-black/60 rounded-lg text-xs font-mono text-emerald-300 border border-emerald-500/20 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(receipt.metadata, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surfaceBorder bg-surface/50 text-xs text-gray-400 flex items-center justify-between">
          <span>{activeEvidenceReceipts.length} total evidence records verifying this claim</span>
          <button
            onClick={closeEvidenceModal}
            className="px-4 py-1.5 rounded-lg bg-surfaceHover hover:bg-surfaceBorder text-white text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
