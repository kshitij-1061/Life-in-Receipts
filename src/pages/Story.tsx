import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Layers, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';

export const Story: React.FC = () => {
  const { storySlides, openEvidenceModal } = useData();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (storySlides.length === 0) return null;

  const currentSlide = storySlides[currentSlideIndex];

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/80 border border-surfaceBorder text-xs text-purple-300 font-mono">
          <Layers className="w-3.5 h-3.5 text-accentMusic" />
          <span>Cinematic Data Narrative</span>
        </div>
        <h2 className="text-4xl font-serif font-bold text-white">
          THE DISCOVERED STORY
        </h2>
        <p className="text-xs text-gray-400">
          Every statement below is generated directly from empirical data evidence.
        </p>
      </div>

      {/* Cinematic Slide Card */}
      <div className="bg-surface/90 border border-surfaceBorder rounded-3xl p-8 sm:p-10 glass-panel space-y-8 shadow-2xl relative">
        
        <div className="flex items-center justify-between border-b border-surfaceBorder pb-4">
          <span className="text-xs font-mono font-bold text-accentMusic tracking-widest uppercase">
            {currentSlide.badge}
          </span>
          <span className="text-xs font-mono text-gray-400">
            Slide {currentSlideIndex + 1} of {storySlides.length}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
            {currentSlide.title}
          </h3>
          <p className="text-base sm:text-lg text-purple-200/90 font-serif italic">
            "{currentSlide.subtitle}"
          </p>
        </div>

        <p className="text-base text-gray-300 leading-relaxed font-sans">
          {currentSlide.narration}
        </p>

        {/* Data Points Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {currentSlide.dataPoints.map((dp, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-surfaceHover/50 border border-surfaceBorder space-y-1">
              <div className="text-[11px] text-gray-400 font-mono">{dp.label}</div>
              <div className="text-lg font-bold font-mono text-white">{dp.value}</div>
            </div>
          ))}
        </div>

        {/* Evidence Banner */}
        <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-accentMusic flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Analytical Explanation</span>
            </div>
            <p className="text-xs text-gray-300">
              {currentSlide.evidenceExplanation}
            </p>
          </div>

          <button
            onClick={() => openEvidenceModal(currentSlide.title, currentSlide.supportingReceipts)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-accentMusic to-accentFinance text-white font-medium text-xs shadow-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            See Evidence ({currentSlide.supportingReceipts.length} records)
          </button>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-surfaceBorder">
          <button
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              currentSlideIndex === 0
                ? 'opacity-40 cursor-not-allowed border-surfaceBorder text-gray-600'
                : 'bg-surfaceHover border-surfaceBorder text-white hover:border-gray-500'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex gap-1.5">
            {storySlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'bg-accentMusic w-6' : 'bg-surfaceBorder'
                }`}
              />
            ))}
          </div>

          <button
            disabled={currentSlideIndex === storySlides.length - 1}
            onClick={() => setCurrentSlideIndex(prev => Math.min(storySlides.length - 1, prev + 1))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              currentSlideIndex === storySlides.length - 1
                ? 'opacity-40 cursor-not-allowed border-surfaceBorder text-gray-600'
                : 'bg-gradient-to-r from-accentFinance to-accentMusic text-white border-transparent hover:opacity-95'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
