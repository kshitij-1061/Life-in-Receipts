export function detectFieldName(columns: string[], candidates: string[]): string | undefined {
  const normalizedCols = columns.map(c => c.trim().toLowerCase().replace(/^\ufeff/, ''));
  for (const candidate of candidates) {
    const candNorm = candidate.toLowerCase();
    const idx = normalizedCols.findIndex(c => c === candNorm || c.includes(candNorm));
    if (idx !== -1) {
      return columns[idx];
    }
  }
  return undefined;
}

export function sanitizeHeader(header: string): string {
  return header.trim().replace(/^\ufeff/, '');
}
