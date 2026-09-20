import type { LifeReceipt } from '../../types/receipt';

export function normalizeAndSortReceipts(lists: LifeReceipt[][]): LifeReceipt[] {
  const combined = lists.flat();
  combined.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  return combined;
}
