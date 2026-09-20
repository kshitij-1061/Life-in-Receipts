import React from 'react';
import { useData } from '../../hooks/useData';
import { Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const DataHealthBar: React.FC = () => {
  const { healthStatus, loading } = useData();

  if (loading) return null;

  const allLoaded = healthStatus.loadedCount === healthStatus.totalDatasets;

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface/80 border border-surfaceBorder text-xs text-gray-300 backdrop-blur-md">
      <div className="flex items-center gap-1.5 font-medium">
        <Database className="w-3.5 h-3.5 text-accentCyan" />
        {allLoaded ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span className="font-semibold text-white">
          {healthStatus.loadedCount}/{healthStatus.totalDatasets} Loaded
        </span>
      </div>

      <div className="text-gray-400 font-mono text-[11px]">
        {formatNumber(healthStatus.totalRecords)} Recs
      </div>
    </div>
  );
};
