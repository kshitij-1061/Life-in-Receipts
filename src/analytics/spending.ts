import type { LifeReceipt } from '../types/receipt';
import type { SpendingMetrics } from '../types/analytics';
import { WEEKDAYS } from '../utils/dates';

export function computeSpendingMetrics(receipts: LifeReceipt[]): SpendingMetrics {
  const financeReceipts = receipts.filter(r => r.source === 'finance' && r.amount !== undefined);

  let totalAmount = 0;
  let largestTransaction: LifeReceipt | null = null;
  const categoryMap: Record<string, { amount: number; count: number }> = {};
  const merchantMap: Record<string, { amount: number; count: number }> = {};
  const hourlyMap: Record<number, { amount: number; count: number }> = {};
  const weekdayMap: Record<number, { amount: number; count: number }> = {};
  const monthlyMap: Record<string, { amount: number; count: number }> = {};

  for (let i = 0; i < 24; i++) hourlyMap[i] = { amount: 0, count: 0 };
  for (let i = 0; i < 7; i++) weekdayMap[i] = { amount: 0, count: 0 };

  let weekendAmount = 0;
  let weekdayAmount = 0;

  for (const r of financeReceipts) {
    const amt = r.amount || 0;
    totalAmount += amt;

    if (!largestTransaction || amt > (largestTransaction.amount || 0)) {
      largestTransaction = r;
    }

    const cat = r.category || 'General';
    if (!categoryMap[cat]) categoryMap[cat] = { amount: 0, count: 0 };
    categoryMap[cat].amount += amt;
    categoryMap[cat].count += 1;

    const merch = r.title || 'Unknown Merchant';
    if (!merchantMap[merch]) merchantMap[merch] = { amount: 0, count: 0 };
    merchantMap[merch].amount += amt;
    merchantMap[merch].count += 1;

    hourlyMap[r.hour].amount += amt;
    hourlyMap[r.hour].count += 1;

    weekdayMap[r.dayOfWeek].amount += amt;
    weekdayMap[r.dayOfWeek].count += 1;

    if (r.dayOfWeek === 0 || r.dayOfWeek === 6) {
      weekendAmount += amt;
    } else {
      weekdayAmount += amt;
    }

    const monthKey = `${r.year}-${String(r.timestamp.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { amount: 0, count: 0 };
    monthlyMap[monthKey].amount += amt;
    monthlyMap[monthKey].count += 1;
  }

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, data]) => ({ category, amount: data.amount, count: data.count }))
    .sort((a, b) => b.amount - a.amount);

  const merchantTop = Object.entries(merchantMap)
    .map(([merchant, data]) => ({ merchant, amount: data.amount, count: data.count }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 15);

  const hourlySpending = Object.entries(hourlyMap).map(([h, data]) => ({
    hour: parseInt(h, 10),
    amount: data.amount,
    count: data.count,
  }));

  const weekdaySpending = Object.entries(weekdayMap).map(([d, data]) => ({
    day: WEEKDAYS[parseInt(d, 10)],
    dayIndex: parseInt(d, 10),
    amount: data.amount,
    count: data.count,
  }));

  const monthlySpending = Object.entries(monthlyMap)
    .map(([month, data]) => ({ month, amount: data.amount, count: data.count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalAmount,
    transactionCount: financeReceipts.length,
    averageAmount: financeReceipts.length > 0 ? totalAmount / financeReceipts.length : 0,
    largestTransaction,
    categoryBreakdown,
    merchantTop,
    hourlySpending,
    weekdaySpending,
    monthlySpending,
    weekendVsWeekday: {
      weekendAmount,
      weekdayAmount,
      ratio: weekdayAmount > 0 ? weekendAmount / weekdayAmount : 0,
    },
  };
}
