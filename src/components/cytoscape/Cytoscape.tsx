'use client';
import type { ElementsDefinition } from 'cytoscape';

import React, { useEffect, useState } from 'react';
import { useCytoscape } from '@/components/cytoscape/hooks/useCytoscape';
import Loader from '@/components/Loader';
import ZoomInput from '@/components/ZoomInput';
import { getJson } from '@/components/cytoscape/getJson';

export function Cytoscape({ currentPackage, setCurrentPackage }: CytoscapeProps) {
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const { cyRef, cyInstance } = useCytoscape(packageGraph, currentPackage, setCurrentPackage);
  useEffect(() => {
    getJson<ElementsDefinition>('/api/fs/getGraph').then(setPackageGraph);
  }, []);

  if (!packageGraph) return <Loader />;

  return (
    <div className="flex flex-col w-full flex-1 gap-2">
      <div ref={cyRef} className="h-[calc(100%-65px)]" />
      <ZoomInput cyInstance={cyInstance} />
    </div>
  );
}

interface CytoscapeProps {
  readonly currentPackage: string;
  readonly setCurrentPackage: (path: string) => void;
}
