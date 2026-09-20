import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { LifeReceipt } from '../types/receipt';
import type { GlobalHealthStatus, DatasetProfile } from '../types/profile';
import type { SpendingMetrics, SpotifyMetrics, ThirdFacetMetrics, Pattern, Chapter, ConnectionEdge, ConnectionNode } from '../types/analytics';
import type { StorySlide } from '../analytics/storyGenerator';

import { loadCSVFile } from '../data/loaders';
import { profileDataset } from '../data/profiler';
import { parseFinancialData } from '../data/parsers/financial';
import { parseSpotifyData } from '../data/parsers/spotify';
import { parseThirdFacetData } from '../data/parsers/thirdFacet';
import { normalizeAndSortReceipts } from '../data/normalizers';

import { computeSpendingMetrics } from '../analytics/spending';
import { computeSpotifyMetrics } from '../analytics/spotify';
import { computeThirdFacetMetrics } from '../analytics/thirdFacet';
import { computeConnections } from '../analytics/connectionEngine';
import { detectPatterns } from '../analytics/patternDetector';
import { generateLifeChapters } from '../analytics/chapterEngine';
import { generateCinematicStory } from '../analytics/storyGenerator';

interface DataContextType {
  loading: boolean;
  errorMsg: string | null;
  healthStatus: GlobalHealthStatus;
  allReceipts: LifeReceipt[];
  filteredReceipts: LifeReceipt[];
  
  // Analytics
  spendingMetrics: SpendingMetrics;
  spotifyMetrics: SpotifyMetrics;
  thirdFacetMetrics: ThirdFacetMetrics;
  
  // Connections & Discovery
  connectionGraph: { nodes: ConnectionNode[]; edges: ConnectionEdge[] };
  patterns: Pattern[];
  chapters: Chapter[];
  storySlides: StorySlide[];
  
  // Controls & Filters
  selectedDateRange: [string, string] | null;
  setSelectedDateRange: (range: [string, string] | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedSource: 'all' | 'finance' | 'spotify' | 'third';
  setSelectedSource: (source: 'all' | 'finance' | 'spotify' | 'third') => void;
  
  // Active Evidence Modal
  activeEvidenceReceipts: LifeReceipt[] | null;
  activeEvidenceTitle: string | null;
  openEvidenceModal: (title: string, receipts: LifeReceipt[]) => void;
  closeEvidenceModal: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

function resolveAssetUrl(relativePath: string): string {
  try {
    const rawBase = import.meta.env.BASE_URL || '/';
    const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';
    const combinedPath = (base + relativePath.replace(/^\//, '')).replace(/\/+/g, '/');
    return new URL(combinedPath, window.location.origin).href;
  } catch {
    return relativePath;
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [rawDatasets, setRawDatasets] = useState<Record<string, DatasetProfile>>({});
  const [allReceipts, setAllReceipts] = useState<LifeReceipt[]>([]);
  
  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState<[string, string] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<'all' | 'finance' | 'spotify' | 'third'>('all');
  
  // Modal state
  const [activeEvidenceReceipts, setActiveEvidenceReceipts] = useState<LifeReceipt[] | null>(null);
  const [activeEvidenceTitle, setActiveEvidenceTitle] = useState<string | null>(null);

  useEffect(() => {
    async function initData() {
      setLoading(true);
      setErrorMsg(null);
      const datasetProfiles: Record<string, DatasetProfile> = {};

      let finReceipts: LifeReceipt[] = [];
      let spReceipts: LifeReceipt[] = [];
      let hhReceipts: LifeReceipt[] = [];

      // 1. Load Financial Dataset
      const finUrl = resolveAssetUrl('data/Augmented_IndiaTransactMultiFacet2024.csv');
      try {
        const finRaw = await loadCSVFile(finUrl);
        datasetProfiles['finance'] = profileDataset('finance', 'Financial Multi-Facet', finRaw);
        finReceipts = parseFinancialData(finRaw);
      } catch (err: any) {
        datasetProfiles['finance'] = {
          id: 'finance',
          name: 'Financial Multi-Facet',
          filename: 'Augmented_IndiaTransactMultiFacet2024.csv',
          loaded: false,
          rowCount: 0,
          columns: [],
          detectedFields: {},
          error: err.message || 'Dataset file could not be loaded.',
        };
      }

      // 2. Load Spotify Dataset (Slice top 20,000 for smooth browser rendering)
      const spUrl = resolveAssetUrl('data/spotify_history.csv');
      try {
        const spRaw = await loadCSVFile(spUrl, 20000);
        datasetProfiles['spotify'] = profileDataset('spotify', 'Spotify History', spRaw);
        spReceipts = parseSpotifyData(spRaw);
      } catch (err: any) {
        datasetProfiles['spotify'] = {
          id: 'spotify',
          name: 'Spotify History',
          filename: 'spotify_history.csv',
          loaded: false,
          rowCount: 0,
          columns: [],
          detectedFields: {},
          error: err.message || 'Dataset file could not be loaded.',
        };
      }

      // 3. Load Third Dataset (Daily Household)
      const hhUrl = resolveAssetUrl('data/Daily%20Household%20Transactions.csv');
      try {
        const hhRaw = await loadCSVFile(hhUrl);
        datasetProfiles['third'] = profileDataset('third', 'Daily Household Log', hhRaw);
        hhReceipts = parseThirdFacetData(hhRaw);
      } catch (err: any) {
        datasetProfiles['third'] = {
          id: 'third',
          name: 'Daily Household Log',
          filename: 'Daily Household Transactions.csv',
          loaded: false,
          rowCount: 0,
          columns: [],
          detectedFields: {},
          error: err.message || 'Dataset file could not be loaded.',
        };
      }

      setRawDatasets(datasetProfiles);

      const combined = normalizeAndSortReceipts([finReceipts, spReceipts, hhReceipts]);
      setAllReceipts(combined);

      const failedProfiles = Object.values(datasetProfiles).filter(p => !p.loaded);
      if (failedProfiles.length > 0 && combined.length === 0) {
        setErrorMsg(`Failed to load dataset: ${failedProfiles[0].error}`);
      }

      setLoading(false);
    }

    initData();
  }, []);

  // Filtered receipts logic
  const filteredReceipts = useMemo(() => {
    return allReceipts.filter(r => {
      if (selectedSource !== 'all' && r.source !== selectedSource) return false;
      if (selectedCategory && r.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (selectedDateRange) {
        if (r.dateStr < selectedDateRange[0] || r.dateStr > selectedDateRange[1]) return false;
      }
      return true;
    });
  }, [allReceipts, selectedSource, selectedCategory, selectedDateRange]);

  // Derived Analytics
  const spendingMetrics = useMemo(() => computeSpendingMetrics(filteredReceipts), [filteredReceipts]);
  const spotifyMetrics = useMemo(() => computeSpotifyMetrics(filteredReceipts), [filteredReceipts]);
  const thirdFacetMetrics = useMemo(() => computeThirdFacetMetrics(filteredReceipts), [filteredReceipts]);

  const connectionGraph = useMemo(() => computeConnections(filteredReceipts), [filteredReceipts]);
  const patterns = useMemo(() => detectPatterns(filteredReceipts), [filteredReceipts]);
  const chapters = useMemo(() => generateLifeChapters(filteredReceipts), [filteredReceipts]);
  const storySlides = useMemo(
    () => generateCinematicStory(filteredReceipts, patterns, chapters, connectionGraph.edges),
    [filteredReceipts, patterns, chapters, connectionGraph.edges]
  );

  const healthStatus: GlobalHealthStatus = useMemo(() => {
    const loadedCount = Object.values(rawDatasets).filter(d => d.loaded).length;
    const totalRecords = allReceipts.length;
    
    let minDate = '2013-01-01';
    let maxDate = '2024-12-31';
    if (allReceipts.length > 0) {
      minDate = allReceipts[0].dateStr;
      maxDate = allReceipts[allReceipts.length - 1].dateStr;
    }

    return {
      loadedCount,
      totalDatasets: 3,
      totalRecords,
      overallDateRange: { min: minDate, max: maxDate },
      datasets: rawDatasets,
    };
  }, [rawDatasets, allReceipts]);

  const openEvidenceModal = (title: string, receipts: LifeReceipt[]) => {
    setActiveEvidenceTitle(title);
    setActiveEvidenceReceipts(receipts);
  };

  const closeEvidenceModal = () => {
    setActiveEvidenceTitle(null);
    setActiveEvidenceReceipts(null);
  };

  return (
    <DataContext.Provider
      value={{
        loading,
        errorMsg,
        healthStatus,
        allReceipts,
        filteredReceipts,
        spendingMetrics,
        spotifyMetrics,
        thirdFacetMetrics,
        connectionGraph,
        patterns,
        chapters,
        storySlides,
        selectedDateRange,
        setSelectedDateRange,
        selectedCategory,
        setSelectedCategory,
        selectedSource,
        setSelectedSource,
        activeEvidenceReceipts,
        activeEvidenceTitle,
        openEvidenceModal,
        closeEvidenceModal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
