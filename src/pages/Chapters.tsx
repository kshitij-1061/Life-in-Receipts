import React from 'react';
import { useData } from '../hooks/useData';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export const Chapters: React.FC = () => {
  const { chapters, openEvidenceModal } = useData();

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accentCyan">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Behavioral Phase Engine</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mt-1">
          LIFE CHAPTERS
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Dynamic behavioral periods segmented by activity volume, category shifts, and digital footprint evolution.
        </p>
      </div>

      {/* Chapters Cards List */}
      <div className="space-y-6">
        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            className="bg-surface/80 border border-surfaceBorder hover:border-gray-600 rounded-2xl p-6 glass-panel space-y-5 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surfaceBorder pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-accentCyan">
                  Chapter {idx + 1}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white">
                  {ch.title}
                </h3>
                <p className="text-xs text-purple-200/80 italic font-serif">
                  "{ch.tagline}"
                </p>
              </div>

              <div className="flex items-center gap-2 bg-surfaceHover px-3 py-1.5 rounded-xl border border-surfaceBorder text-xs font-mono text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-accentCyan" />
                <span>{ch.startDate} → {ch.endDate}</span>
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-surfaceHover/50 border border-surfaceBorder">
                <div className="text-[11px] text-gray-400 font-mono">Financial Highlight</div>
                <div className="text-xs font-semibold text-white mt-1">{ch.financialHighlight}</div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceHover/50 border border-surfaceBorder">
                <div className="text-[11px] text-gray-400 font-mono">Auditory Highlight</div>
                <div className="text-xs font-semibold text-white mt-1">{ch.listeningHighlight}</div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceHover/50 border border-surfaceBorder">
                <div className="text-[11px] text-gray-400 font-mono">Dominant Focus</div>
                <div className="text-xs font-semibold text-accentCyan mt-1">{ch.dominantCategory}</div>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              {ch.summary}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => openEvidenceModal(`Chapter Evidence: ${ch.title}`, ch.supportingReceipts)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-surfaceHover hover:bg-surfaceBorder border border-surfaceBorder text-xs text-accentCyan font-medium transition-all"
              >
                <span>Inspect Chapter Evidence ({formatNumber(ch.receiptCount)} records)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
