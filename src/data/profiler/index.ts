import type { RawCSVResult } from '../loaders';
import type { DatasetProfile, ColumnInfo } from '../../types/profile';
import { parseFlexibleDate, formatDateStr } from '../../utils/dates';
import { detectFieldName } from '../../utils/fieldDetection';

export function profileDataset(id: string, name: string, data: RawCSVResult): DatasetProfile {
  const columns: ColumnInfo[] = data.columns.map(col => {
    const samples = data.rows.slice(0, 50).map(r => r[col]).filter(v => v !== undefined && v !== null && v !== '');
    
    let detectedType: ColumnInfo['detectedType'] = 'unknown';
    if (samples.length > 0) {
      const first = samples[0];
      if (!isNaN(Number(first))) {
        detectedType = 'number';
      } else if (typeof first === 'boolean' || first === 'true' || first === 'false') {
        detectedType = 'boolean';
      } else if (parseFlexibleDate(String(first))) {
        detectedType = 'date';
      } else {
        detectedType = 'string';
      }
    }

    return {
      name: col,
      detectedType,
      sampleValues: samples.slice(0, 3),
    };
  });

  // Detect key fields
  const dateField = detectFieldName(data.columns, ['trans_date_trans_time', 'ts', 'date', 'timestamp', 'time']);
  const amountField = detectFieldName(data.columns, ['amt', 'amount', 'price', 'val', 'cost']);
  const categoryField = detectFieldName(data.columns, ['category', 'genre', 'type']);
  const titleField = detectFieldName(data.columns, ['merchant', 'track_name', 'note', 'title', 'item']);
  const locationField = detectFieldName(data.columns, ['city', 'state', 'location', 'street']);

  // Date range detection
  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  if (dateField) {
    for (const row of data.rows) {
      const val = row[dateField];
      const parsed = parseFlexibleDate(val);
      if (parsed) {
        if (!minDate || parsed < minDate) minDate = parsed;
        if (!maxDate || parsed > maxDate) maxDate = parsed;
      }
    }
  }

  return {
    id,
    name,
    filename: data.filename,
    loaded: true,
    rowCount: data.totalRows,
    columns,
    dateRange: minDate && maxDate ? {
      min: formatDateStr(minDate),
      max: formatDateStr(maxDate),
    } : undefined,
    detectedFields: {
      dateField,
      amountField,
      categoryField,
      titleField,
      locationField,
    },
  };
}
