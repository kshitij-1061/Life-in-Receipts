import type { RawCSVResult } from '../loaders';
import type { LifeReceipt } from '../../types/receipt';
import { parseFlexibleDate, formatDateStr, formatTimeStr } from '../../utils/dates';

export function parseThirdFacetData(raw: RawCSVResult): LifeReceipt[] {
  const receipts: LifeReceipt[] = [];

  for (let i = 0; i < raw.rows.length; i++) {
    const row = raw.rows[i];
    const dateVal = row['Date'] || row['date'] || row['timestamp'];
    const dt = parseFlexibleDate(dateVal);
    if (!dt) continue;

    const category = (row['Category'] || 'Household').trim();
    const subcategory = (row['Subcategory'] || '').trim();
    const note = (row['Note'] || '').trim();
    const mode = (row['Mode'] || 'Cash').trim();
    const amt = parseFloat(row['Amount'] || '0');
    const incomeExpense = row['Income/Expense'] || 'Expense';

    const title = subcategory || note || category;
    const subtitle = `${category} (${mode})`;

    const tags: string[] = ['Household Log', incomeExpense];
    const hour = dt.getHours();
    const dayOfWeek = dt.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) tags.push('Weekend');
    if (hour >= 22 || hour <= 4) tags.push('Late Night');
    if (note) tags.push('Annotated');

    receipts.push({
      id: `hh_${i}`,
      source: 'third',
      sourceLabel: 'Household Entry',
      type: category.toUpperCase().replace(/\s+/g, '_'),
      timestamp: dt,
      dateStr: formatDateStr(dt),
      timeStr: formatTimeStr(dt),
      hour,
      dayOfWeek,
      year: dt.getFullYear(),
      title,
      subtitle,
      amount: amt > 0 ? amt : 0,
      currency: 'INR',
      category,
      location: note ? note : undefined,
      tags,
      metadata: row,
    });
  }

  return receipts;
}
