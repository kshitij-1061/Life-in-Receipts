import type { LifeReceipt } from './receipt';

export interface SpendingMetrics {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  largestTransaction: LifeReceipt | null;
  categoryBreakdown: { category: string; amount: number; count: number }[];
  merchantTop: { merchant: string; amount: number; count: number }[];
  hourlySpending: { hour: number; amount: number; count: number }[];
  weekdaySpending: { day: string; dayIndex: number; amount: number; count: number }[];
  monthlySpending: { month: string; amount: number; count: number }[];
  weekendVsWeekday: { weekendAmount: number; weekdayAmount: number; ratio: number };
}

export interface SpotifyMetrics {
  totalTracksPlayed: number;
  totalListeningMs: number;
  totalListeningHours: number;
  topArtists: { artist: string; count: number; hours: number }[];
  topTracks: { track: string; artist: string; count: number }[];
  topAlbums: { album: string; artist: string; count: number }[];
  hourlyListening: { hour: number; count: number; hours: number }[];
  weekdayListening: { day: string; dayIndex: number; count: number; hours: number }[];
  skipRate: number;
}

export interface ThirdFacetMetrics {
  totalRecords: number;
  totalExpense: number;
  topCategories: { category: string; amount: number; count: number }[];
  topSubcategories: { subcategory: string; amount: number; count: number }[];
  modesOfPayment: { mode: string; count: number; amount: number }[];
  recurringItems: { item: string; count: number }[];
}

export interface ConnectionEvidence {
  reason: string;
  signals: string[];
  supportingRecords: LifeReceipt[];
  strength: number; // 0.0 to 1.0
  timeDeltaMinutes?: number;
}

export interface ConnectionNode {
  id: string;
  receiptId: string;
  source: 'finance' | 'spotify' | 'third';
  title: string;
  subtitle?: string;
  category?: string;
  amount?: number;
  timestamp: Date;
  dateStr: string;
}

export interface ConnectionEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  evidence: ConnectionEvidence;
}

export interface Pattern {
  id: string;
  title: string;
  description: string;
  salienceScore: number;
  category: 'co-occurrence' | 'diurnal' | 'spending' | 'listening' | 'recurring';
  evidenceExplanation: string;
  supportingReceipts: LifeReceipt[];
  visualMetric?: { label: string; value: string };
}

export interface Chapter {
  id: string;
  title: string;
  tagline: string;
  startDate: string;
  endDate: string;
  receiptCount: number;
  financialHighlight: string;
  listeningHighlight: string;
  thirdFacetHighlight: string;
  dominantCategory: string;
  topArtist: string;
  summary: string;
  supportingReceipts: LifeReceipt[];
}
