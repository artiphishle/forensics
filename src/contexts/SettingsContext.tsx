'use client';
import React, { createContext, use, useState, type PropsWithChildren } from 'react';
import {
  getCytoscapeLayout,
  getCytoscapeLayoutSpacing,
  getShowSubPackages,
  getShowVendorPackages,
} from '@/utils/parseEnv';

// Settings context
const SettingsContext = createContext<ISettingsContext | null>(null);

// Settings provider
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [showSubPackages, setShowSubPackages] = useState(getShowSubPackages());
  const [showVendorPackages, setShowVendorPackages] = useState(getShowVendorPackages());
  const [cytoscapeLayout, setCytoscapeLayout] = useState<CytoscapeLayout>(getCytoscapeLayout());
  const [cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing] = useState<number>(
    getCytoscapeLayoutSpacing()
  );

  const toggleShowSubPackages = () => setShowSubPackages(prev => !prev);
  const toggleShowVendorPackages = () => setShowVendorPackages(prev => !prev);

  return (
    <SettingsContext
      value={{
        cytoscapeLayout,
        cytoscapeLayoutSpacing,
        showSubPackages,
        showVendorPackages,
        setCytoscapeLayout,
        setCytoscapeLayoutSpacing,
        toggleShowSubPackages,
        toggleShowVendorPackages,
      }}
    >
      {children}
    </SettingsContext>
  );
};

// Hook to read/update settings
export function useSettings() {
  const context = use(SettingsContext);
  if (!context) throw new Error('useSettings() must be used within a SettingsProvider');
  return context;
}

interface ISettingsContext {
  readonly cytoscapeLayout: CytoscapeLayout;
  readonly cytoscapeLayoutSpacing: number;
  readonly showSubPackages: boolean;
  readonly showVendorPackages: boolean;
  readonly setCytoscapeLayout: (layout: CytoscapeLayout) => void;
  readonly setCytoscapeLayoutSpacing: (layoutSpacing: number) => void;
  readonly toggleShowSubPackages: () => void;
  readonly toggleShowVendorPackages: () => void;
}

export type CytoscapeLayout = 'circle' | 'concentric' | 'grid';
