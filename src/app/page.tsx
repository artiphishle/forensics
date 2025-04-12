'use client';
import { useEffect, useState } from 'react';
import { ElementsDefinition } from 'cytoscape';
import Breadcrumb from '@/components/Breadcrumb';
import Cytoscape from '@/components/Cytoscape';
import { getJson } from '@/hooks/getJson';
import Header from '@/components/Header';
import Main from '@/components/Main';

export default function Home() {
  const initialCurrentPath = process.env.NEXT_PUBLIC_CURRENT_PATH || '';
  // const [graph, setGraph] = useState<ICytoscapeGraph | null>(null);
  const [weightedGraph, setWeightedGraph] = useState<ElementsDefinition | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(initialCurrentPath);

  useEffect(() => {
    // getJson<ICytoscapeGraph>('/api/fs/getCytoscapeGraph').then(setGraph);
    getJson<ElementsDefinition>('/api/fs/getWeightedCytoscapeGraph').then(setWeightedGraph);
  }, []);

  if (!weightedGraph) return;

  return (
    <>
      <Header title="Packages">
        <Breadcrumb
          path={currentPath}
          onNavigate={pkg => setCurrentPath(pkg.replace(/\./g, '/'))}
        />
      </Header>
      <Main>
        <Cytoscape
          elements={weightedGraph}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
      </Main>
    </>
  );
}
