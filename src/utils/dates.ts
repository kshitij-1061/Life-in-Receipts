export function parseFlexibleDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const str = dateStr.trim();
  if (!str) return null;

  // 1. Try standard ISO parse
  const isoDate = new Date(str);
  if (!isNaN(isoDate.getTime()) && isoDate.getFullYear() > 1990 && isoDate.getFullYear() < 2030) {
    return isoDate;
  }

  // 2. Try DD/MM/YYYY HH:mm:ss or DD/MM/YYYY
  const dmYMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (dmYMatch) {
    const day = parseInt(dmYMatch[1], 10);
    const month = parseInt(dmYMatch[2], 10) - 1; // 0-indexed
    const year = parseInt(dmYMatch[3], 10);
    const hour = dmYMatch[4] ? parseInt(dmYMatch[4], 10) : 0;
    const min = dmYMatch[5] ? parseInt(dmYMatch[5], 10) : 0;
    const sec = dmYMatch[6] ? parseInt(dmYMatch[6], 10) : 0;

    const d = new Date(year, month, day, hour, min, sec);
    if (!isNaN(d.getTime())) return d;
  }

  // 3. Try MM/DD/YYYY HH:mm:ss or MM/DD/YYYY
  const mdYMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (mdYMatch) {
    const m = parseInt(mdYMatch[1], 10) - 1;
    const d = parseInt(mdYMatch[2], 10);
    const y = parseInt(mdYMatch[3], 10);
    const h = mdYMatch[4] ? parseInt(mdYMatch[4], 10) : 0;
    const min = mdYMatch[5] ? parseInt(mdYMatch[5], 10) : 0;
    const s = mdYMatch[6] ? parseInt(mdYMatch[6], 10) : 0;

    const dt = new Date(y, m, d, h, min, s);
    if (!isNaN(dt.getTime())) return dt;
  }

  return null;
}

export function formatDateStr(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatTimeStr(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getDiurnalPhase(hour: number): 'Late Night' | 'Morning' | 'Afternoon' | 'Evening' {
  if (hour >= 0 && hour < 6) return 'Late Night';
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon';
  return 'Evening';
}
