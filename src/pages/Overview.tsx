import React from 'react';
import { useData } from '../hooks/useData';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Compass, Database, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { MetricCard } from '../components/common/MetricCard';
import { MoneyHasSoundtrackView } from '../components/charts/MoneyHasSoundtrackView';

export const Overview: React.FC = () => {
  const { healthStatus, spendingMetrics, spotifyMetrics, thirdFacetMetrics, patterns, chapters } = useData();

  return (
    <div className="space-y-10 py-6 animate-fade-in">
      
      {/* Header */}
      <SectionHeader
        badge="Digital Observatory"
        title="LIFE OBSERVATORY"
        subtitle="High-level dataset telemetry, data quality metrics, and cross-dataset co-occurrence signals."
        icon={Compass}
        badgeColor="text-accentCyan"
      />

      {/* Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          label="Total Valid Records"
          value={formatNumber(healthStatus.validRecords)}
          subtext="100% Real Empirical Records"
          icon={CheckCircle2}
          accentColor="text-white"
        />

        <MetricCard
          label="Card & Household Spend"
          value={formatCurrency(spendingMetrics.totalAmount + thirdFacetMetrics.totalExpense)}
          subtext={`${spendingMetrics.transactionCount + thirdFacetMetrics.totalRecords} Financial Logs`}
          accentColor="text-accentFinance"
        />

        <MetricCard
          label="Listening Duration"
          value={`${Math.round(spotifyMetrics.totalListeningHours)} hrs`}
          subtext={`${formatNumber(spotifyMetrics.totalTracksPlayed)} Spotify Streams`}
          accentColor="text-accentMusic"
        />

        <MetricCard
          label="Discovered Chapters"
          value={`${chapters.length} Phases`}
          subtext={`${patterns.length} Statistical Patterns`}
          accentColor="text-accentCyan"
        />
      </div>

      {/* Dataset Profiles Table & Quality Metrics */}
      <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surfaceBorder/60 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
            <Database className="w-4 h-4 text-accentCyan" />
            <span>Loaded Dataset Health & Quality Profiles</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {formatNumber(healthStatus.validRecords)} Valid Records
            </span>
            {healthStatus.skippedRecords > 0 && (
              <span className="text-amber-400">
                ({healthStatus.skippedRecords} Skipped)
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-surfaceBorder text-gray-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Raw Rows</th>
                <th className="py-3 px-4">Valid Rows</th>
                <th className="py-3 px-4">Date Range</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surfaceBorder/50">
              {Object.values(healthStatus.datasets).map((ds) => (
                <tr key={ds.id} className="hover:bg-surfaceHover/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{ds.name}</td>
                  <td className="py-3 px-4 font-mono text-gray-400">{ds.filename}</td>
                  <td className="py-3 px-4 font-mono text-gray-400">
                    {formatNumber(ds.rowCount)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-accentCyan">
                    {formatNumber(ds.validRowCount)}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-400">
                    {ds.dateRange ? `${ds.dateRange.min} → ${ds.dateRange.max}` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {ds.loaded ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                        ✓ Verified
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
