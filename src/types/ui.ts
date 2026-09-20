import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface FilterState {
  selectedDateRange: [string, string] | null;
  selectedCategory: string | null;
  selectedSource: 'all' | 'finance' | 'spotify' | 'third';
  searchQuery: string;
}
