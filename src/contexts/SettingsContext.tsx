'use client';
import React, { createContext, use, useState, type PropsWithChildren } from 'react';
import { getShowSubPackages } from '@/utils/parseEnv';

// Settings context
const SettingsContext = createContext<ISettingsContext | null>(null);

// Settings provider
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [showSubPackages, setShowSubPackages] = useState(getShowSubPackages());
  const [showVendorPackages, setShowVendorPackages] = useState(getShowSubPackages());

  const toggleShowSubPackages = () => setShowSubPackages(prev => !prev);
  const toggleShowVendorPackages = () => setShowVendorPackages(prev => !prev);

  return (
    <SettingsContext
      value={{
        showSubPackages,
        toggleShowSubPackages,
        showVendorPackages,
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
  showSubPackages: boolean;
  showVendorPackages: boolean;
  toggleShowSubPackages: () => void;
  toggleShowVendorPackages: () => void;
}
