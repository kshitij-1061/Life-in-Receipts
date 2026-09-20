import React from 'react';
import { useData } from '../../hooks/useData';
import { Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const DataHealthBar: React.FC = () => {
  const { healthStatus, loading } = useData();

  if (loading) return null;

  const allLoaded = healthStatus.loadedCount === healthStatus.totalDatasets;

  return (
    <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface/80 border border-surfaceBorder text-[11px] text-gray-300 backdrop-blur-md whitespace-nowrap">
      <div className="flex items-center gap-1.5 font-medium min-w-0">
        <Database className="w-3.5 h-3.5 text-accentCyan flex-shrink-0" />
        {allLoaded ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        )}
        <span className="font-semibold text-white whitespace-nowrap">
          {healthStatus.loadedCount}/{healthStatus.totalDatasets} Loaded
        </span>
      </div>

      <span className="text-gray-600 px-1 font-mono">|</span>

      <div className="text-gray-400 font-mono text-[10px] whitespace-nowrap flex-shrink-0">
        {formatNumber(healthStatus.totalRecords)} Recs
      </div>
    </div>
  );
};
