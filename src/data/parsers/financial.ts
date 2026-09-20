import type { RawCSVResult } from '../loaders';
import type { LifeReceipt } from '../../types/receipt';
import { parseFlexibleDate, formatDateStr, formatTimeStr } from '../../utils/dates';

export function parseFinancialData(raw: RawCSVResult): LifeReceipt[] {
  const receipts: LifeReceipt[] = [];

  for (let i = 0; i < raw.rows.length; i++) {
    const row = raw.rows[i];
    const dateVal = row['trans_date_trans_time'] || row['date'] || row['trans_date'];
    const dt = parseFlexibleDate(dateVal);
    if (!dt) continue;

    const amt = parseFloat(row['amt'] || row['amount'] || '0');
    const rawMerchant = (row['merchant'] || '').replace(/^fraud_/, '').trim();
    const merchant = rawMerchant || 'Card Merchant';
    const category = (row['category'] || 'General Spending').toLowerCase().replace(/_/g, ' ');
    const city = row['city'] || '';
    const state = row['state'] || '';
    const location = [city, state].filter(Boolean).join(', ') || 'India';

    const tags: string[] = ['Financial', 'Transaction'];
    const hour = dt.getHours();
    const dayOfWeek = dt.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) tags.push('Weekend');
    if (hour >= 22 || hour <= 4) tags.push('Late Night');
    if (amt > 5000) tags.push('High Value');

    receipts.push({
      id: `fin_${row['trans_id'] || i}`,
      source: 'finance',
      sourceLabel: 'Card Transaction',
      type: category.toUpperCase().replace(/\s+/g, '_'),
      timestamp: dt,
      dateStr: formatDateStr(dt),
      timeStr: formatTimeStr(dt),
      hour,
      dayOfWeek,
      year: dt.getFullYear(),
      title: merchant,
      subtitle: category,
      amount: amt > 0 ? amt : 0,
      currency: '₹',
      category,
      location,
      tags,
      metadata: row,
    });
  }

  return receipts;
}
