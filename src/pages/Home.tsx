import React from 'react';
import { useData } from '../hooks/useData';
import { Sparkles, ArrowRight, Music, CircleDollarSign, Share2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  triggerFindInteresting: () => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, triggerFindInteresting }) => {
  const { spendingMetrics, spotifyMetrics, thirdFacetMetrics } = useData();

  return (
    <div className="space-y-16 py-8 animate-fade-in">
      
      {/* Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6 pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/80 border border-surfaceBorder text-xs text-purple-300 font-mono tracking-wide shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-accentMusic animate-pulse" />
          <span>Interactive Data Storytelling Experience</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
          LIFE IN RECEIPTS
        </h1>

        <p className="text-xl sm:text-2xl text-purple-200/90 font-serif italic">
          "Your financial life has a soundtrack."
        </p>

        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Hundreds of card transactions. Thousands of Spotify listening hours. Personal household micro-notes. 
          Individually, they are just records in a database. Connected together, they tell your story.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accentFinance to-accentMusic text-white font-semibold text-sm shadow-xl shadow-purple-950/30 hover:opacity-95 hover:scale-105 transition-all"
          >
            <span>Uncover My Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={triggerFindInteresting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-surface hover:bg-surfaceHover border border-surfaceBorder text-gray-200 font-semibold text-sm transition-all hover:border-purple-500/50"
          >
            <Sparkles className="w-4 h-4 text-accentYellow" />
            <span>Find Something Interesting</span>
          </button>
        </div>
      </div>

      {/* Dataset Observatory Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div 
          onClick={() => setActiveTab('money')}
          className="glass-card rounded-2xl p-6 space-y-4 cursor-pointer hover:border-accentFinance/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-accentFinance group-hover:scale-110 transition-transform">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-gray-400">Primary Financial Facet</div>
            <h3 className="text-2xl font-bold font-mono text-white mt-1">
              {formatCurrency(spendingMetrics.totalAmount)}
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              {formatNumber(spendingMetrics.transactionCount)} multi-facet card transactions across India.
            </p>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('soundtrack')}
          className="glass-card rounded-2xl p-6 space-y-4 cursor-pointer hover:border-accentMusic/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-accentMusic group-hover:scale-110 transition-transform">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-gray-400">Spotify Auditory Facet</div>
            <h3 className="text-2xl font-bold font-mono text-white mt-1">
              {Math.round(spotifyMetrics.totalListeningHours)} Hours
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              {formatNumber(spotifyMetrics.totalTracksPlayed)} tracks logged across artists & albums.
            </p>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('connections')}
          className="glass-card rounded-2xl p-6 space-y-4 cursor-pointer hover:border-accentHousehold/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-accentHousehold group-hover:scale-110 transition-transform">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-gray-400">Household & Cross-Connections</div>
            <h3 className="text-2xl font-bold font-mono text-white mt-1">
              {formatNumber(thirdFacetMetrics.totalRecords)} Entries
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Micro-expenses, commute logs, and co-occurrence evidence nodes.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
