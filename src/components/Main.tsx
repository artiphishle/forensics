import React from 'react';
import { Cytoscape } from '@/components/cytoscape/Cytoscape';
import Settings from '@/components/Settings';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function Main({ currentPackage, setCurrentPackage }: MainProps) {
  return (
    <main data-testid="main" className="p-4 flex flex-col md:flex-row flex-1 dark:bg-[#171717]">
      <SettingsProvider>
        <Settings />
        <Cytoscape currentPackage={currentPackage} setCurrentPackage={setCurrentPackage} />
      </SettingsProvider>
    </main>
  );
}

interface MainProps {
  readonly currentPackage: string;
  readonly setCurrentPackage: (path: string) => void;
}
