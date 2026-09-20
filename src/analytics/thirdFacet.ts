import type { LifeReceipt } from '../types/receipt';
import type { ThirdFacetMetrics } from '../types/analytics';

export function computeThirdFacetMetrics(receipts: LifeReceipt[]): ThirdFacetMetrics {
  const householdReceipts = receipts.filter(r => r.source === 'third');

  let totalExpense = 0;
  const categoryMap: Record<string, { amount: number; count: number }> = {};
  const subcategoryMap: Record<string, { amount: number; count: number }> = {};
  const modeMap: Record<string, { amount: number; count: number }> = {};
  const itemMap: Record<string, number> = {};

  for (const r of householdReceipts) {
    const amt = r.amount || 0;
    totalExpense += amt;

    const cat = r.category || 'Other';
    if (!categoryMap[cat]) categoryMap[cat] = { amount: 0, count: 0 };
    categoryMap[cat].amount += amt;
    categoryMap[cat].count += 1;

    const sub = r.title || cat;
    if (!subcategoryMap[sub]) subcategoryMap[sub] = { amount: 0, count: 0 };
    subcategoryMap[sub].amount += amt;
    subcategoryMap[sub].count += 1;

    const modeMatch = (r.subtitle || '').match(/\((.*?)\)/);
    const mode = modeMatch ? modeMatch[1] : 'Cash';
    if (!modeMap[mode]) modeMap[mode] = { amount: 0, count: 0 };
    modeMap[mode].amount += amt;
    modeMap[mode].count += 1;

    if (r.title) {
      itemMap[r.title] = (itemMap[r.title] || 0) + 1;
    }
  }

  const topCategories = Object.entries(categoryMap)
    .map(([category, data]) => ({ category, amount: data.amount, count: data.count }))
    .sort((a, b) => b.amount - a.amount);

  const topSubcategories = Object.entries(subcategoryMap)
    .map(([subcategory, data]) => ({ subcategory, amount: data.amount, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const modesOfPayment = Object.entries(modeMap)
    .map(([mode, data]) => ({ mode, amount: data.amount, count: data.count }))
    .sort((a, b) => b.count - a.count);

  const recurringItems = Object.entries(itemMap)
    .map(([item, count]) => ({ item, count }))
    .filter(x => x.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalRecords: householdReceipts.length,
    totalExpense,
    topCategories,
    topSubcategories,
    modesOfPayment,
    recurringItems,
  };
}
