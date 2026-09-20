import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  accentColor?: string; // e.g. 'text-accentFinance' or 'text-accentMusic'
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  accentColor = 'text-white',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 space-y-1 ${
        onClick ? 'cursor-pointer hover:border-pink-500/40' : ''
      }`}
    >
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase">
        <span>{label}</span>
        {Icon && <Icon className={`w-4 h-4 ${accentColor}`} />}
      </div>
      <div className={`text-3xl font-bold font-mono ${accentColor} mt-1 tracking-tight`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-gray-400 font-sans truncate mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
};
