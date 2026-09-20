import React from 'react';
import { useData } from '../../hooks/useData';
import { Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const DataHealthBar: React.FC = () => {
  const { healthStatus, loading } = useData();

  if (loading) return null;

  const allLoaded = healthStatus.loadedCount === healthStatus.totalDatasets;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-surface/80 border border-surfaceBorder text-xs text-gray-300 backdrop-blur-md">
      <div className="flex items-center gap-1.5 font-medium">
        <Database className="w-3.5 h-3.5 text-accentCyan" />
        <span>Data Health:</span>
      </div>

      <div className="flex items-center gap-1">
        {allLoaded ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span className="font-semibold text-white">
          {healthStatus.loadedCount}/{healthStatus.totalDatasets} Loaded
        </span>
      </div>

      <span className="text-gray-600">|</span>

      <div className="text-gray-400 font-mono">
        {formatNumber(healthStatus.totalRecords)} Records
      </div>

      <span className="text-gray-600">|</span>

      <div className="text-gray-400 font-mono hidden md:block">
        {healthStatus.overallDateRange.min.slice(0, 4)} - {healthStatus.overallDateRange.max.slice(0, 4)}
      </div>
    </div>
  );
};
