import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badgeColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  icon: Icon,
  badgeColor = 'text-accentMusic',
}) => {
  return (
    <div className="space-y-1">
      {badge && (
        <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest ${badgeColor}`}>
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{badge}</span>
        </div>
      )}
      <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-gray-400 max-w-2xl leading-relaxed mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};
