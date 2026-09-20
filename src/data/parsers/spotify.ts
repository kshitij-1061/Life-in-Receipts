import type { RawCSVResult } from '../loaders';
import type { LifeReceipt } from '../../types/receipt';
import { parseFlexibleDate, formatDateStr, formatTimeStr } from '../../utils/dates';

export function parseSpotifyData(raw: RawCSVResult): LifeReceipt[] {
  const receipts: LifeReceipt[] = [];

  for (let i = 0; i < raw.rows.length; i++) {
    const row = raw.rows[i];
    const tsVal = row['ts'] || row['timestamp'] || row['date'];
    const dt = parseFlexibleDate(tsVal);
    if (!dt) continue;

    const track = row['track_name'] || 'Unknown Track';
    const artist = row['artist_name'] || 'Unknown Artist';
    const album = row['album_name'] || '';
    const msPlayed = parseInt(row['ms_played'] || '0', 10);
    const skipped = String(row['skipped']).toLowerCase() === 'true';

    const tags: string[] = ['Spotify', 'Music'];
    const hour = dt.getHours();
    const dayOfWeek = dt.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) tags.push('Weekend');
    if (hour >= 22 || hour <= 4) tags.push('Late Night');
    if (skipped) tags.push('Skipped');

    receipts.push({
      id: `sp_${i}`,
      source: 'spotify',
      sourceLabel: 'Spotify Listen',
      type: 'SPOTIFY_PLAY',
      timestamp: dt,
      dateStr: formatDateStr(dt),
      timeStr: formatTimeStr(dt),
      hour,
      dayOfWeek,
      year: dt.getFullYear(),
      title: track,
      subtitle: artist,
      artist,
      track,
      album,
      durationMs: msPlayed,
      skipped,
      category: 'Music',
      tags,
      metadata: row,
    });
  }

  return receipts;
}
