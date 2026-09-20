import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { CircleDollarSign, TrendingUp, ShoppingBag, MapPin } from 'lucide-react';
import { formatCurrency, formatNumber, formatDatePretty } from '../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const Money: React.FC = () => {
  const { spendingMetrics, openEvidenceModal, filteredReceipts } = useData();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  const displayTxns = selectedCategoryFilter
    ? filteredReceipts.filter(r => r.source === 'finance' && r.category === selectedCategoryFilter)
    : filteredReceipts.filter(r => r.source === 'finance');

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accentFinance">
          <CircleDollarSign className="w-3.5 h-3.5" />
          <span>Financial Facet Analytics</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mt-1">
          MONEY & COMMERCE
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Card transaction velocity, merchant distribution, category breakdowns, and high-value spending peaks.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-mono text-gray-400 uppercase">Total Card Spend</div>
          <div className="text-3xl font-bold font-mono text-accentFinance mt-1">
            {formatCurrency(spendingMetrics.totalAmount)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {formatNumber(spendingMetrics.transactionCount)} Total Transactions
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-mono text-gray-400 uppercase">Average Transaction</div>
          <div className="text-3xl font-bold font-mono text-white mt-1">
            {formatCurrency(spendingMetrics.averageAmount)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Per Card Purchase</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-mono text-gray-400 uppercase">Weekend Share</div>
          <div className="text-3xl font-bold font-mono text-accentYellow mt-1">
            {formatCurrency(spendingMetrics.weekendVsWeekday.weekendAmount)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Saturday & Sunday Purchases</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-mono text-gray-400 uppercase">Largest Single Txn</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {spendingMetrics.largestTransaction ? formatCurrency(spendingMetrics.largestTransaction.amount) : 'N/A'}
          </div>
          <div className="text-xs text-gray-400 truncate mt-1">
            {spendingMetrics.largestTransaction?.title || 'None'}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-accentFinance" />
              <span>Spending by Category</span>
            </h3>
            {selectedCategoryFilter && (
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className="text-xs text-accentCyan hover:underline font-mono"
              >
                Reset Category Filter
              </button>
            )}
          </div>

          <div className="space-y-3">
            {spendingMetrics.categoryBreakdown.map((cat) => {
              const pct = spendingMetrics.totalAmount > 0 ? (cat.amount / spendingMetrics.totalAmount) * 100 : 0;
              const isSelected = selectedCategoryFilter === cat.category;

              return (
                <div
                  key={cat.category}
                  onClick={() => setSelectedCategoryFilter(isSelected ? null : cat.category)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500/50'
                      : 'bg-surfaceHover/50 border-surfaceBorder hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white capitalize">{cat.category}</span>
                    <span className="font-mono font-bold text-accentFinance">{formatCurrency(cat.amount)}</span>
                  </div>

                  <div className="w-full bg-surface border border-surfaceBorder h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accentFinance to-accentYellow h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>{cat.count} transactions</span>
                    <span>{pct.toFixed(1)}% of total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Merchants */}
        <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accentFinance" />
            <span>Top Merchant Destinations</span>
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingMetrics.merchantTop.slice(0, 8)} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis dataKey="merchant" type="category" stroke="#64748b" fontSize={10} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#13161f', borderColor: '#222736', borderRadius: '12px' }}
                  formatter={(val: any) => [formatCurrency(val), 'Spent']}
                />
                <Bar dataKey="amount" fill="#f97316" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction Records List */}
      <div className="bg-surface/80 border border-surfaceBorder rounded-2xl p-6 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-mono">
            Transaction Records ({displayTxns.length})
          </h3>
          <button
            onClick={() => openEvidenceModal('Financial Transaction Evidence', displayTxns)}
            className="px-3 py-1.5 rounded-lg bg-surfaceHover border border-surfaceBorder text-xs text-accentCyan hover:text-white"
          >
            View as Evidence Drawer
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayTxns.slice(0, 9).map((txn) => (
            <div
              key={txn.id}
              onClick={() => openEvidenceModal(`Transaction Detail: ${txn.title}`, [txn])}
              className="p-4 rounded-xl bg-surfaceHover/40 border border-surfaceBorder hover:border-accentFinance/40 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono text-[10px]">
                  {txn.category || 'General'}
                </span>
                <span className="text-gray-400 font-mono">{formatDatePretty(txn.timestamp)}</span>
              </div>

              <div className="font-semibold text-white truncate">{txn.title}</div>

              {txn.location && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span className="truncate">{txn.location}</span>
                </div>
              )}

              <div className="text-right font-mono font-bold text-accentFinance text-base pt-1">
                {formatCurrency(txn.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
