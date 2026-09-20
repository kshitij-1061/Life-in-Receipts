import type { LifeReceipt } from '../types/receipt';
import type { ConnectionEdge, ConnectionEvidence, ConnectionNode } from '../types/analytics';
import { getDiurnalPhase, WEEKDAYS } from '../utils/dates';

export interface ConnectionGraphData {
  nodes: ConnectionNode[];
  edges: ConnectionEdge[];
}

export function computeConnections(receipts: LifeReceipt[], maxConnections = 120): ConnectionGraphData {
  if (receipts.length === 0) return { nodes: [], edges: [] };

  // Sample or bucket receipts to keep graph responsive
  const sampledMap: Record<string, LifeReceipt> = {};
  
  // Pick key representatives: top financial transactions, top spotify tracks, household entries
  const finReceipts = receipts.filter(r => r.source === 'finance').slice(0, 100);
  const spReceipts = receipts.filter(r => r.source === 'spotify').slice(0, 150);
  const hhReceipts = receipts.filter(r => r.source === 'third').slice(0, 80);

  const selected = [...finReceipts, ...spReceipts, ...hhReceipts];
  selected.forEach(r => { sampledMap[r.id] = r; });

  const nodes: ConnectionNode[] = selected.map(r => ({
    id: r.id,
    receiptId: r.id,
    source: r.source,
    title: r.title,
    subtitle: r.subtitle,
    category: r.category,
    amount: r.amount,
    timestamp: r.timestamp,
    dateStr: r.dateStr,
  }));

  const edges: ConnectionEdge[] = [];
  let edgeIdCounter = 0;

  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const r1 = selected[i];
      const r2 = selected[j];

      // Don't connect receipts of exact same source unless special co-occurrence
      if (r1.source === r2.source) continue;

      const signals: string[] = [];
      let totalScore = 0;
      let timeDeltaMins: number | undefined = undefined;

      // 1. Same Date Match
      if (r1.dateStr === r2.dateStr) {
        signals.push('Occurred on the exact same date');
        totalScore += 0.4;
      }

      // 2. Timestamp delta check
      const diffMs = Math.abs(r1.timestamp.getTime() - r2.timestamp.getTime());
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (diffMins <= 30) {
        signals.push(`Occurred within ${diffMins} minutes of each other`);
        totalScore += 0.5;
        timeDeltaMins = diffMins;
      } else if (diffMins <= 180 && r1.dateStr === r2.dateStr) {
        signals.push(`Occurred within ${Math.round(diffMins / 60)} hours on same day`);
        totalScore += 0.25;
        timeDeltaMins = diffMins;
      }

      // 3. Same Day of Week & Diurnal Phase
      if (r1.dayOfWeek === r2.dayOfWeek) {
        const phase1 = getDiurnalPhase(r1.hour);
        const phase2 = getDiurnalPhase(r2.hour);
        if (phase1 === phase2) {
          signals.push(`Both occurred during ${WEEKDAYS[r1.dayOfWeek]} ${phase1}`);
          totalScore += 0.2;
        }
      }

      // 4. Category / Keyword Similarity
      const cat1 = (r1.category || '').toLowerCase();
      const cat2 = (r2.category || '').toLowerCase();

      if (
        (cat1.includes('entertainment') && r2.source === 'spotify') ||
        (cat1.includes('food') && cat2.includes('food')) ||
        (cat1.includes('subscription') && r2.source === 'spotify')
      ) {
        signals.push(`Shared category context (${r1.category} ↔ ${r2.category || 'Music'})`);
        totalScore += 0.25;
      }

      // 5. Keyword match in title/note
      const text1 = `${r1.title} ${r1.subtitle || ''}`.toLowerCase();
      const text2 = `${r2.title} ${r2.subtitle || ''}`.toLowerCase();
      const keywords1 = text1.split(/\s+/).filter(w => w.length > 3);
      const matchedKw = keywords1.find(kw => text2.includes(kw));

      if (matchedKw) {
        signals.push(`Matching keyword '${matchedKw}' in details`);
        totalScore += 0.3;
      }

      if (totalScore >= 0.45) {
        const strength = Math.min(1.0, totalScore);
        const reason = signals[0] || 'Statistical temporal co-occurrence';

        const evidence: ConnectionEvidence = {
          reason,
          signals,
          supportingRecords: [r1, r2],
          strength,
          timeDeltaMinutes: timeDeltaMins,
        };

        edges.push({
          id: `edge_${++edgeIdCounter}`,
          source: r1.id,
          target: r2.id,
          weight: strength,
          evidence,
        });

        if (edges.length >= maxConnections) break;
      }
    }
    if (edges.length >= maxConnections) break;
  }

  return { nodes, edges };
}
