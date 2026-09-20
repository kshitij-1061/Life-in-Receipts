import React from 'react';
import { Layers } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No matching records found',
  description = 'Try adjusting your date range, source filters, or category selections.',
  onResetFilters,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-2xl bg-surface border border-surfaceBorder flex items-center justify-center mx-auto text-accentMusic">
        <Layers className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-serif font-bold text-white">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-surfaceHover hover:bg-surfaceBorder border border-surfaceBorder text-xs text-accentCyan font-medium transition-all"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
};
