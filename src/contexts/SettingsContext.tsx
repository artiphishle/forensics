'use client';
import type { CytoscapeLayout } from '@/themes/types';

import React, { createContext, use, type PropsWithChildren } from 'react';
import {
  getCytoscapeLayout,
  getCytoscapeLayoutSpacing,
  getShowSubPackages,
  getShowVendorPackages,
  getSubPackageDepth,
} from '@/utils/parseEnv';
import { useLocalStorage } from '@/store/useLocalStorage';

// Settings context
const SettingsContext = createContext<ISettingsContext | null>(null);

// Settings provider
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [maxSubPackageDepth, setMaxSubPackageDepth] = useLocalStorage<number | null>(
    'maxSubPackageDepth',
    null
  );
  const [showSubPackages, setShowSubPackages] = useLocalStorage<boolean>(
    'showSubPackages',
    getShowSubPackages()
  );
  const [showVendorPackages, setShowVendorPackages] = useLocalStorage<boolean>(
    'showVendorPackages',
    getShowVendorPackages()
  );
  const [subPackageDepth, setSubPackageDepth] = useLocalStorage<number>(
    'showVendorPackages',
    getSubPackageDepth()
  );
  const [cytoscapeLayout, setCytoscapeLayout] = useLocalStorage<CytoscapeLayout>(
    'cytoscapeLayout',
    getCytoscapeLayout()
  );
  const [cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing] = useLocalStorage<number>(
    'cytoscapeLayoutSpacing',
    getCytoscapeLayoutSpacing()
  );

  const toggleShowSubPackages = () => setShowSubPackages(prev => !prev);
  const toggleShowVendorPackages = () => setShowVendorPackages(prev => !prev);

  return (
    <SettingsContext
      value={{
        cytoscapeLayout,
        cytoscapeLayoutSpacing,
        maxSubPackageDepth,
        showSubPackages,
        showVendorPackages,
        subPackageDepth,
        setCytoscapeLayout,
        setCytoscapeLayoutSpacing,
        setMaxSubPackageDepth,
        setSubPackageDepth,
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
  readonly maxSubPackageDepth: number | null;
  readonly showSubPackages: boolean;
  readonly subPackageDepth: number;
  readonly showVendorPackages: boolean;
  readonly setCytoscapeLayout: (layout: CytoscapeLayout) => void;
  readonly setCytoscapeLayoutSpacing: (layoutSpacing: number) => void;
  readonly setMaxSubPackageDepth: (depth: number | null) => void;
  readonly setSubPackageDepth: (depth: number) => void;
  readonly toggleShowSubPackages: () => void;
  readonly toggleShowVendorPackages: () => void;
}
