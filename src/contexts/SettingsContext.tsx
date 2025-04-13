'use client';
import React, { createContext, use, useState, type PropsWithChildren } from 'react';
import { getShowSubPackages } from '@/utils/parseEnv';

// Settings context
const SettingsContext = createContext<ISettingsContext | null>(null);

// Settings provider
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [showSubPackages, setShowSubPackages] = useState(getShowSubPackages());
  const toggleShowSubPackages = () => {
    setShowSubPackages(prev => !prev);
  };

  return (
    <SettingsContext value={{ showSubPackages, toggleShowSubPackages }}>{children}</SettingsContext>
  );
};

// Hook to read/update settings
export function useSettings() {
  const context = use(SettingsContext);
  if (!context) throw new Error('ThemeSwitcher must be used within a ThemeProvider');
  return context;
}

interface ISettingsContext {
  showSubPackages: boolean;
  toggleShowSubPackages: () => void;
}
