import React from 'react';
import { useData } from '../hooks/useData';
import { Music, Mic, PlayCircle, Clock } from 'lucide-react';
import { formatNumber, formatDuration } from '../utils/formatters';
import { SectionHeader } from '../components/common/SectionHeader';
import { MetricCard } from '../components/common/MetricCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const Soundtrack: React.FC = () => {
  const { spotifyMetrics } = useData();

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      
      {/* Header */}
      <SectionHeader
        badge="Auditory Facet Analytics"
        title="SOUNDTRACK & LISTENING"
        subtitle="Spotify playback duration, top artists, track repetitions, skip rates, and diurnal listening cycles."
        icon={Music}
        badgeColor="text-accentMusic"
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          label="Listening Duration"
          value={`${Math.round(spotifyMetrics.totalListeningHours)} hrs`}
          subtext={`${formatDuration(spotifyMetrics.totalListeningMs)} Total Time`}
          accentColor="text-accentMusic"
        />

        <MetricCard
          label="Tracks Streamed"
          value={formatNumber(spotifyMetrics.totalTracksPlayed)}
          subtext="Individual Playback Events"
          accentColor="text-white"
        />

        <MetricCard
          label="Top Artist"
          value={spotifyMetrics.topArtists[0]?.artist || 'N/A'}
          subtext={`${spotifyMetrics.topArtists[0]?.count || 0} Playbacks`}
          accentColor="text-accentCyan"
        />

        <MetricCard
          label="Skip Rate"
          value={`${spotifyMetrics.skipRate.toFixed(1)}%`}
          subtext="Early Track Transitions"
          accentColor="text-amber-400"
        />
      </div>

      {/* Top Artists & Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Artists List */}
        <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Mic className="w-4 h-4 text-accentMusic" />
            <span>Top Artists</span>
          </h3>

          <div className="space-y-3">
            {spotifyMetrics.topArtists.slice(0, 7).map((art, idx) => (
              <div
                key={art.artist}
                className="p-3 bg-surfaceHover/50 border border-surfaceBorder rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-mono font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-white text-sm">{art.artist}</div>
                    <div className="text-[11px] text-gray-400">{art.count} streams</div>
                  </div>
                </div>

                <div className="font-mono text-xs text-accentMusic font-bold">
                  {art.hours.toFixed(1)} hrs
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tracks List */}
        <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-accentMusic" />
            <span>Top Repeated Tracks</span>
          </h3>

          <div className="space-y-3">
            {spotifyMetrics.topTracks.slice(0, 7).map((trk, idx) => (
              <div
                key={trk.track + '_' + idx}
                className="p-3 bg-surfaceHover/50 border border-surfaceBorder rounded-xl flex items-center justify-between"
              >
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="font-semibold text-white text-sm truncate">{trk.track}</div>
                  <div className="text-[11px] text-gray-400 truncate">{trk.artist}</div>
                </div>

                <div className="font-mono text-xs text-accentCyan font-bold">
                  {trk.count} Plays
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Listening Distribution */}
      <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
        <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
          <Clock className="w-4 h-4 text-accentMusic" />
          <span>Hourly Listening Intensity (Diurnal Cycles)</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spotifyMetrics.hourlyListening}>
              <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickFormatter={(h) => `${h}:00`} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#13161f', borderColor: '#222736', borderRadius: '12px' }}
                formatter={(val: any) => [`${val} tracks`, 'Streams']}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
