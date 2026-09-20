import type { LifeReceipt, DataValidationResult } from '../../types/data';

export function validateReceipts(rawReceipts: LifeReceipt[]): DataValidationResult {
  const validReceipts: LifeReceipt[] = [];
  let skippedCount = 0;
  const warnings: string[] = [];
  const seenIds = new Set<string>();

  for (const receipt of rawReceipts) {
    // 1. Timestamp validation
    if (!receipt.timestamp || isNaN(receipt.timestamp.getTime())) {
      skippedCount++;
      warnings.push(`Skipped record ${receipt.id}: Invalid or unparseable timestamp.`);
      continue;
    }

    // 2. Reasonable date range check (1995 to 2030)
    const year = receipt.timestamp.getFullYear();
    if (year < 1995 || year > 2030) {
      skippedCount++;
      warnings.push(`Skipped record ${receipt.id}: Out of range year (${year}).`);
      continue;
    }

    // 3. Title/Title Presence
    if (!receipt.title || receipt.title.trim() === '') {
      skippedCount++;
      warnings.push(`Skipped record ${receipt.id}: Missing title/merchant/track name.`);
      continue;
    }

    // 4. De-duplication check
    if (seenIds.has(receipt.id)) {
      skippedCount++;
      warnings.push(`Skipped duplicate record ID: ${receipt.id}`);
      continue;
    }

    seenIds.add(receipt.id);
    validReceipts.push(receipt);
  }

  return {
    validReceipts,
    skippedCount,
    warnings,
  };
}
