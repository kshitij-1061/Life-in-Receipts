export function formatCurrency(amount: number | undefined | null, currency: string = '₹'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currency}0`;
  return `${currency}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatDuration(ms: number | undefined | null): string {
  if (!ms || isNaN(ms)) return '0m';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-IN');
}

export function formatDatePretty(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
