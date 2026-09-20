import React from 'react';
import { useData } from '../hooks/useData';
import { NetworkGraph } from '../components/charts/NetworkGraph';
import { Share2, ShieldCheck, ChevronRight } from 'lucide-react';

export const Connections: React.FC = () => {
  const { connectionGraph, openEvidenceModal } = useData();

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accentMusic">
          <Share2 className="w-3.5 h-3.5 text-accentCyan" />
          <span>Signature Connection Engine</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mt-1">
          CROSS-DATASET CONNECTIONS
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Interactive network graph visualizing discovered relationships between card transactions, Spotify plays, and household micro-notes.
        </p>
      </div>

      {/* D3 Network Graph */}
      <NetworkGraph nodes={connectionGraph.nodes} edges={connectionGraph.edges} />

      {/* Discovered Edge Evidence List */}
      <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accentCyan" />
            <span>Discovered Evidence Connections ({connectionGraph.edges.length})</span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            Sorted by evidence strength
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectionGraph.edges.slice(0, 10).map((edge) => {
            const ev = edge.evidence;
            const r1 = ev.supportingRecords[0];
            const r2 = ev.supportingRecords[1];

            if (!r1 || !r2) return null;

            return (
              <div
                key={edge.id}
                onClick={() => openEvidenceModal(`Connection Evidence: ${edge.id}`, ev.supportingRecords)}
                className="p-4 bg-surfaceHover/40 border border-surfaceBorder hover:border-accentCyan/50 rounded-xl cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono text-[10px] border border-purple-500/20">
                    Strength Score: {(ev.strength * 100).toFixed(0)}%
                  </span>
                  <span className="text-gray-400 font-mono">{r1.dateStr}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {r1.title} ↔ {r2.title}
                  </div>
                  <div className="text-xs text-accentCyan font-mono">
                    ✓ {ev.reason}
                  </div>
                </div>

                <div className="space-y-1 border-t border-surfaceBorder/50 pt-2 text-[11px] text-gray-400">
                  {ev.signals.map((sig, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span>•</span>
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <span className="text-[11px] text-accentCyan hover:underline font-mono flex items-center gap-1">
                    Inspect Evidence Records <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
