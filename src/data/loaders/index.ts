import Papa from 'papaparse';
import { sanitizeHeader } from '../../utils/fieldDetection';

export interface RawCSVResult {
  filename: string;
  columns: string[];
  rows: Record<string, any>[];
  totalRows: number;
}

export async function loadCSVFile(url: string, maxRows?: number): Promise<RawCSVResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => sanitizeHeader(h),
      complete: (results) => {
        let rows = results.data as Record<string, any>[];
        const totalRows = rows.length;
        if (maxRows && rows.length > maxRows) {
          rows = rows.slice(0, maxRows);
        }
        const columns = results.meta.fields || (rows.length > 0 ? Object.keys(rows[0]) : []);
        resolve({
          filename: url.split('/').pop() || url,
          columns,
          rows,
          totalRows,
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
