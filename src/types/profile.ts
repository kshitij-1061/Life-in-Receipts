export interface ColumnInfo {
  name: string;
  detectedType: 'string' | 'number' | 'date' | 'boolean' | 'unknown';
  sampleValues: any[];
}

export interface DatasetProfile {
  id: string;
  name: string;
  filename: string;
  loaded: boolean;
  rowCount: number;
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

export interface GlobalHealthStatus {
  loadedCount: number;
  totalDatasets: number;
  totalRecords: number;
  overallDateRange: {
    min: string;
    max: string;
  };
  datasets: Record<string, DatasetProfile>;
}
