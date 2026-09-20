import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Music, CircleDollarSign, Home, Calendar } from 'lucide-react';

export const MoneyHasSoundtrackView: React.FC = () => {
  const { allReceipts, openEvidenceModal } = useData();

  // Aggregate by Month-Year
  const timelineData = useMemo(() => {
    const map: Record<string, { month: string; financeAmt: number; spotifyCount: number; householdAmt: number; receipts: any[] }> = {};

    for (const r of allReceipts) {
      const monthKey = `${r.year}-${String(r.timestamp.getMonth() + 1).padStart(2, '0')}`;
      if (!map[monthKey]) {
        map[monthKey] = { month: monthKey, financeAmt: 0, spotifyCount: 0, householdAmt: 0, receipts: [] };
      }
      map[monthKey].receipts.push(r);
      if (r.source === 'finance') map[monthKey].financeAmt += r.amount || 0;
      if (r.source === 'spotify') map[monthKey].spotifyCount += 1;
      if (r.source === 'third') map[monthKey].householdAmt += r.amount || 0;
    }

    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
  }, [allReceipts]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const activeMonth = timelineData[selectedIndex] || timelineData[0];

  return (
    <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surfaceBorder pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accentMusic">
            <Music className="w-3.5 h-3.5" />
            <span>Synchronized Multi-Track Timeline</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mt-1">
            MONEY HAS A SOUNDTRACK
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Scrub across time to observe how financial transactions and music listening co-exist.
          </p>
        </div>

        {activeMonth && (
          <div className="flex items-center gap-2 bg-surfaceHover px-4 py-2 rounded-xl border border-surfaceBorder">
            <Calendar className="w-4 h-4 text-accentCyan" />
            <span className="font-mono text-sm font-bold text-white">{activeMonth.month}</span>
          </div>
        )}
      </div>

      {/* Chart Visualizer */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData}>
            <defs>
              <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#13161f', borderColor: '#222736', borderRadius: '12px' }}
              formatter={(val: any, name: any) => [
                name === 'financeAmt' ? formatCurrency(val) : formatNumber(val),
                name === 'financeAmt' ? 'Financial Spending' : 'Spotify Plays',
              ]}
            />
            <Area type="monotone" dataKey="financeAmt" stroke="#f97316" fillOpacity={1} fill="url(#colorFin)" />
            <Area type="monotone" dataKey="spotifyCount" stroke="#a855f7" fillOpacity={1} fill="url(#colorSp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Timeline Slider */}
      {timelineData.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-gray-400">
            <span>{timelineData[0].month}</span>
            <span className="text-accentCyan font-bold">Scrub Timeline</span>
            <span>{timelineData[timelineData.length - 1].month}</span>
          </div>
          <input
            type="range"
            min={0}
            max={timelineData.length - 1}
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
            className="w-full accent-accentMusic h-2 bg-surfaceHover rounded-lg cursor-pointer"
          />
        </div>
      )}

      {/* Active Month Snapshot Card */}
      {activeMonth && (
        <div className="bg-surfaceHover/50 border border-surfaceBorder rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-4 flex-1">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-orange-400">
                <CircleDollarSign className="w-4 h-4" />
                <span>Card Spend</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {formatCurrency(activeMonth.financeAmt)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-purple-400">
                <Music className="w-4 h-4" />
                <span>Spotify Streams</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {formatNumber(activeMonth.spotifyCount)} Tracks
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Home className="w-4 h-4" />
                <span>Household Log</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {formatCurrency(activeMonth.householdAmt)}
              </div>
            </div>
          </div>

          <button
            onClick={() => openEvidenceModal(`Month Evidence: ${activeMonth.month}`, activeMonth.receipts)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-accentMusic to-accentFinance text-white font-medium text-xs shadow-lg hover:opacity-90 transition-opacity"
          >
            Inspect Month Evidence ({activeMonth.receipts.length})
          </button>
        </div>
      )}

    </div>
  );
};
