import React from 'react';
import { useData } from '../hooks/useData';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Compass, Database, CheckCircle2 } from 'lucide-react';
import { MoneyHasSoundtrackView } from '../components/charts/MoneyHasSoundtrackView';

export const Overview: React.FC = () => {
  const { healthStatus, spendingMetrics, spotifyMetrics, thirdFacetMetrics, patterns, chapters } = useData();

  return (
    <div className="space-y-10 py-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accentCyan">
          <Compass className="w-3.5 h-3.5" />
          <span>Digital Observatory</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mt-1">
          LIFE OBSERVATORY
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          High-level dataset telemetry, empirical record counts, and cross-dataset co-occurrence signals.
        </p>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-1">
          <div className="text-xs font-mono text-gray-400 uppercase">Total Records</div>
          <div className="text-3xl font-bold font-mono text-white">
            {formatNumber(healthStatus.totalRecords)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>3 Datasets Loaded</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <div className="text-xs font-mono text-gray-400 uppercase">Card & Household Spend</div>
          <div className="text-3xl font-bold font-mono text-accentFinance">
            {formatCurrency(spendingMetrics.totalAmount + thirdFacetMetrics.totalExpense)}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            {spendingMetrics.transactionCount + thirdFacetMetrics.totalRecords} Financial Logs
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <div className="text-xs font-mono text-gray-400 uppercase">Listening Duration</div>
          <div className="text-3xl font-bold font-mono text-accentMusic">
            {Math.round(spotifyMetrics.totalListeningHours)} hrs
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            {formatNumber(spotifyMetrics.totalTracksPlayed)} Spotify Streams
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <div className="text-xs font-mono text-gray-400 uppercase">Discovered Chapters</div>
          <div className="text-3xl font-bold font-mono text-accentCyan">
            {chapters.length} Phases
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            {patterns.length} Statistical Patterns
          </div>
        </div>
      </div>

      {/* Dataset Profiles Table */}
      <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
          <Database className="w-4 h-4 text-accentCyan" />
          <span>Loaded Dataset Health & Schema Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-surfaceBorder text-gray-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Row Count</th>
                <th className="py-3 px-4">Date Range</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surfaceBorder/50">
              {Object.values(healthStatus.datasets).map((ds) => (
                <tr key={ds.id} className="hover:bg-surfaceHover/50">
                  <td className="py-3 px-4 font-semibold text-white">{ds.name}</td>
                  <td className="py-3 px-4 font-mono text-gray-400">{ds.filename}</td>
                  <td className="py-3 px-4 font-mono font-bold text-accentCyan">
                    {formatNumber(ds.rowCount)}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-400">
                    {ds.dateRange ? `${ds.dateRange.min} → ${ds.dateRange.max}` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {ds.loaded ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                        ✓ Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">
                        ⚠ Unavailable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Money Has a Soundtrack Dual Timeline */}
      <MoneyHasSoundtrackView />

    </div>
  );
};
