import type { LifeReceipt } from '../types/receipt';
import type { SpotifyMetrics } from '../types/analytics';
import { WEEKDAYS } from '../utils/dates';

export function computeSpotifyMetrics(receipts: LifeReceipt[]): SpotifyMetrics {
  const spotifyReceipts = receipts.filter(r => r.source === 'spotify');

  let totalListeningMs = 0;
  let skippedCount = 0;

  const artistMap: Record<string, { count: number; ms: number }> = {};
  const trackMap: Record<string, { artist: string; count: number }> = {};
  const albumMap: Record<string, { artist: string; count: number }> = {};
  const hourlyMap: Record<number, { count: number; ms: number }> = {};
  const weekdayMap: Record<number, { count: number; ms: number }> = {};

  for (let i = 0; i < 24; i++) hourlyMap[i] = { count: 0, ms: 0 };
  for (let i = 0; i < 7; i++) weekdayMap[i] = { count: 0, ms: 0 };

  for (const r of spotifyReceipts) {
    const ms = r.durationMs || 0;
    totalListeningMs += ms;
    if (r.skipped) skippedCount++;

    const art = r.artist || 'Unknown Artist';
    if (!artistMap[art]) artistMap[art] = { count: 0, ms: 0 };
    artistMap[art].count += 1;
    artistMap[art].ms += ms;

    const trkKey = `${r.title} --- ${art}`;
    if (!trackMap[trkKey]) trackMap[trkKey] = { artist: art, count: 0 };
    trackMap[trkKey].count += 1;

    if (r.album) {
      const albKey = `${r.album} --- ${art}`;
      if (!albumMap[albKey]) albumMap[albKey] = { artist: art, count: 0 };
      albumMap[albKey].count += 1;
    }

    hourlyMap[r.hour].count += 1;
    hourlyMap[r.hour].ms += ms;

    weekdayMap[r.dayOfWeek].count += 1;
    weekdayMap[r.dayOfWeek].ms += ms;
  }

  const topArtists = Object.entries(artistMap)
    .map(([artist, data]) => ({ artist, count: data.count, hours: data.ms / (1000 * 3600) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const topTracks = Object.entries(trackMap)
    .map(([key, data]) => ({ track: key.split(' --- ')[0], artist: data.artist, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const topAlbums = Object.entries(albumMap)
    .map(([key, data]) => ({ album: key.split(' --- ')[0], artist: data.artist, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const hourlyListening = Object.entries(hourlyMap).map(([h, data]) => ({
    hour: parseInt(h, 10),
    count: data.count,
    hours: data.ms / (1000 * 3600),
  }));

  const weekdayListening = Object.entries(weekdayMap).map(([d, data]) => ({
    day: WEEKDAYS[parseInt(d, 10)],
    dayIndex: parseInt(d, 10),
    count: data.count,
    hours: data.ms / (1000 * 3600),
  }));

  return {
    totalTracksPlayed: spotifyReceipts.length,
    totalListeningMs,
    totalListeningHours: totalListeningMs / (1000 * 3600),
    topArtists,
    topTracks,
    topAlbums,
    hourlyListening,
    weekdayListening,
    skipRate: spotifyReceipts.length > 0 ? (skippedCount / spotifyReceipts.length) * 100 : 0,
  };
}
