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
  
  // Spotify specific fields
  durationMs?: number;
  artist?: string;
  track?: string;
  album?: string;
  skipped?: boolean;

  tags: string[];               // Auto-generated tags (e.g., 'Weekend', 'Late Night', 'High Value')
  metadata: Record<string, unknown>; // 100% original raw CSV fields
}

export interface ColumnInfo {
  name: string;
  detectedType: 'string' | 'number' | 'date' | 'boolean' | 'unknown';
  sampleValues: unknown[];
}

export interface DatasetProfile {
  id: string;
  name: string;
  filename: string;
  loaded: boolean;
  rowCount: number;
  validRowCount: number;
  skippedRowCount: number;
  columns: ColumnInfo[];
  dateRange?: {
    min: string;
    max: string;
  };
  detectedFields: {
    dateField?: string;
    amountField?: string;
    categoryField?: string;
    titleField?: string;
    locationField?: string;
  };
  error?: string;
}

export interface DataValidationResult {
  validReceipts: LifeReceipt[];
  skippedCount: number;
  warnings: string[];
}

export interface GlobalHealthStatus {
  loadedCount: number;
  totalDatasets: number;
  totalRecords: number;
  validRecords: number;
  skippedRecords: number;
  overallDateRange: {
    min: string;
    max: string;
  };
  datasets: Record<string, DatasetProfile>;
}
