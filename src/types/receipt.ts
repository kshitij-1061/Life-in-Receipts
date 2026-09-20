export type ReceiptSource = 'finance' | 'spotify' | 'third';

export interface LifeReceipt {
  id: string;
  source: ReceiptSource;
  sourceLabel: string;          // e.g. "Card Transaction", "Spotify Play", "Household Expense"
  type: string;                 // e.g., "ENTERTAINMENT", "TRACK_LISTEN", "COMMUTE"
  timestamp: Date;
  dateStr: string;              // YYYY-MM-DD
  timeStr: string;              // HH:mm:ss
  hour: number;                 // 0-23
  dayOfWeek: number;            // 0=Sun, 6=Sat
  year: number;

  title: string;                // Merchant / Song Name / Expense Item
  subtitle?: string;            // Category / Artist / Mode
  amount?: number;              // Numeric value (for finance & household)
  currency?: string;            // e.g. INR
  category?: string;            // Normalized category
  location?: string;            // City / State / Place Note
  
  // Spotify specific normalized fields
  durationMs?: number;
  artist?: string;
  track?: string;
  album?: string;
  skipped?: boolean;

  tags: string[];               // Auto-generated tags (e.g., 'Weekend', 'Late Night', 'High Value')
  metadata: Record<string, any>;// 100% original raw CSV fields
}
