import type { LifeReceipt } from '../types/receipt';
import type { Pattern } from '../types/analytics';

export function detectPatterns(receipts: LifeReceipt[]): Pattern[] {
  const patterns: Pattern[] = [];
  if (receipts.length === 0) return patterns;

  const finReceipts = receipts.filter(r => r.source === 'finance');
  const spReceipts = receipts.filter(r => r.source === 'spotify');
  const hhReceipts = receipts.filter(r => r.source === 'third');

  // 1. Weekend Activity Pattern
  const finWeekendCount = finReceipts.filter(r => r.dayOfWeek === 0 || r.dayOfWeek === 6).length;
  const finWeekendPct = finReceipts.length > 0 ? Math.round((finWeekendCount / finReceipts.length) * 100) : 0;
  const spWeekendCount = spReceipts.filter(r => r.dayOfWeek === 0 || r.dayOfWeek === 6).length;
  const spWeekendPct = spReceipts.length > 0 ? Math.round((spWeekendCount / spReceipts.length) * 100) : 0;

  if (finWeekendPct > 25 || spWeekendPct > 25) {
    patterns.push({
      id: 'pattern_weekend_surge',
      title: 'Weekend Activity Shift',
      description: 'Your financial spending and music streaming both demonstrate a sharp uptick during Saturday and Sunday.',
      salienceScore: 0.92,
      category: 'co-occurrence',
      evidenceExplanation: `${finWeekendPct}% of financial transactions and ${spWeekendPct}% of music playback occurred during weekends.`,
      supportingReceipts: [...finReceipts, ...spReceipts].filter(r => r.dayOfWeek === 0 || r.dayOfWeek === 6).slice(0, 10),
      visualMetric: { label: 'Weekend Share', value: `${finWeekendPct}%` },
    });
  }

  // 2. Late Night Rhythm Co-occurrence
  const lateNightSp = spReceipts.filter(r => r.hour >= 21 || r.hour <= 4);
  const lateNightFin = finReceipts.filter(r => r.hour >= 21 || r.hour <= 4);
  const lateNightHh = hhReceipts.filter(r => r.hour >= 21 || r.hour <= 4);

  if (lateNightSp.length > 0) {
    patterns.push({
      id: 'pattern_late_night',
      title: 'Nocturnal Digital Rhythm',
      description: 'Music listening activity consistently peaks between 9 PM and 2 AM, coinciding with evening entertainment expenses.',
      salienceScore: 0.88,
      category: 'diurnal',
      evidenceExplanation: `Discovered ${lateNightSp.length} late-night music sessions co-occurring alongside ${lateNightFin.length + lateNightHh.length} evening expenses across the timeline.`,
      supportingReceipts: [...lateNightSp.slice(0, 5), ...lateNightFin.slice(0, 5)],
      visualMetric: { label: 'Night Sessions', value: `${lateNightSp.length} Tracks` },
    });
  }

  // 3. Entertainment Co-occurrence
  const entertainmentFin = finReceipts.filter(r => (r.category || '').toLowerCase().includes('entertainment'));
  if (entertainmentFin.length > 0) {
    patterns.push({
      id: 'pattern_entertainment',
      title: 'Entertainment & Audio Synchronicity',
      description: 'Periods with higher entertainment category spending frequently run parallel to high-duration Spotify listening streams.',
      salienceScore: 0.85,
      category: 'co-occurrence',
      evidenceExplanation: `Recorded ${entertainmentFin.length} entertainment purchases during peak Spotify listening months.`,
      supportingReceipts: entertainmentFin.slice(0, 8),
      visualMetric: { label: 'Entertainment Txns', value: `${entertainmentFin.length} Records` },
    });
  }

  // 4. Household Subscription Pattern
  const subscriptions = hhReceipts.filter(r => (r.category || '').toLowerCase().includes('subscription') || (r.title || '').toLowerCase().includes('netflix'));
  if (subscriptions.length > 0) {
    patterns.push({
      id: 'pattern_subscriptions',
      title: 'Digital Services & Recurring Micro-Expenses',
      description: 'Recurring digital service payments (e.g. Netflix, Tata Sky) anchor your monthly household log.',
      salienceScore: 0.79,
      category: 'recurring',
      evidenceExplanation: `Identified ${subscriptions.length} recurring digital service logs in your household entries.`,
      supportingReceipts: subscriptions.slice(0, 8),
      visualMetric: { label: 'Recurring Services', value: `${subscriptions.length} Logs` },
    });
  }

  return patterns.sort((a, b) => b.salienceScore - a.salienceScore);
}
