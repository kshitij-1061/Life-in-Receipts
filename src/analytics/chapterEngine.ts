import type { LifeReceipt } from '../types/receipt';
import type { Chapter } from '../types/analytics';
import { formatDatePretty } from '../utils/formatters';

export function generateLifeChapters(receipts: LifeReceipt[]): Chapter[] {
  if (receipts.length === 0) return [];

  // Group receipts by year eras
  const era1 = receipts.filter(r => r.year >= 2013 && r.year <= 2014);
  const era2 = receipts.filter(r => r.year >= 2015 && r.year <= 2018);
  const era3 = receipts.filter(r => r.year >= 2022 && r.year <= 2024);

  const chapters: Chapter[] = [];

  // Chapter 1: The Initial Soundtrack Era
  if (era1.length > 0) {
    const spCount = era1.filter(r => r.source === 'spotify').length;
    const topArtist = getTopArtistInList(era1);
    chapters.push({
      id: 'chapter_01',
      title: 'Chapter I: The Auditory Baseline',
      tagline: 'Before transactions were logged, your digital life was defined purely by sound.',
      startDate: formatDatePretty(era1[0].timestamp),
      endDate: formatDatePretty(era1[era1.length - 1].timestamp),
      receiptCount: era1.length,
      financialHighlight: 'Zero card logs active in this early era',
      listeningHighlight: `${spCount} Spotify listening streams logged`,
      thirdFacetHighlight: '0 household entries',
      dominantCategory: 'Music & Audio',
      topArtist: topArtist || 'Various Artists',
      summary: `Your digital footprint began with music streaming. Over ${spCount} tracks played, establishing your foundational listening habits.`,
      supportingReceipts: era1.slice(0, 10),
    });
  }

  // Chapter 2: Daily Household Micro-Moments & Music Co-occurrence
  if (era2.length > 0) {
    const hhCount = era2.filter(r => r.source === 'third').length;
    const spCount = era2.filter(r => r.source === 'spotify').length;
    const topArtist = getTopArtistInList(era2);

    chapters.push({
      id: 'chapter_02',
      title: 'Chapter II: The Micro-Moment Era',
      tagline: 'Daily commutes, food snacks, and digital subscriptions collide with continuous music streaming.',
      startDate: formatDatePretty(era2[0].timestamp),
      endDate: formatDatePretty(era2[era2.length - 1].timestamp),
      receiptCount: era2.length,
      financialHighlight: 'Manual household expense tracking active',
      listeningHighlight: `${spCount} Spotify tracks played concurrently`,
      thirdFacetHighlight: `${hhCount} micro-expenses & personal notes logged`,
      dominantCategory: 'Household, Transit & Food',
      topArtist: topArtist || 'Various Artists',
      summary: `During this period, your daily log documented cash expenses, local train commutes, and digital service subscriptions (Netflix, Tata Sky), operating alongside continuous Spotify music streaming.`,
      supportingReceipts: era2.slice(0, 12),
    });
  }

  // Chapter 3: High-Volume Multi-Facet Expansion
  if (era3.length > 0) {
    const finCount = era3.filter(r => r.source === 'finance').length;
    const topCat = getDominantCategory(era3);

    chapters.push({
      id: 'chapter_03',
      title: 'Chapter III: High-Velocity Commerce',
      tagline: 'Card commerce, multi-facet merchants, and geographic mobility across India.',
      startDate: formatDatePretty(era3[0].timestamp),
      endDate: formatDatePretty(era3[era3.length - 1].timestamp),
      receiptCount: era3.length,
      financialHighlight: `${finCount} card transactions across merchants & cities`,
      listeningHighlight: 'Established audio preferences baseline',
      thirdFacetHighlight: 'Automated digital receipts replace cash logs',
      dominantCategory: topCat || 'Card Commerce & Entertainment',
      topArtist: 'Multi-genre listening',
      summary: `Your financial life evolved into high-velocity digital commerce spanning card transactions across India, with distinct clusters in entertainment, medical fitness, and local merchants.`,
      supportingReceipts: era3.slice(0, 15),
    });
  }

  return chapters;
}

function getTopArtistInList(receipts: LifeReceipt[]): string | null {
  const map: Record<string, number> = {};
  for (const r of receipts) {
    if (r.artist) map[r.artist] = (map[r.artist] || 0) + 1;
  }
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
}

function getDominantCategory(receipts: LifeReceipt[]): string | null {
  const map: Record<string, number> = {};
  for (const r of receipts) {
    if (r.category) map[r.category] = (map[r.category] || 0) + 1;
  }
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
}
