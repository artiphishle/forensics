'use client';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Cytoscape from '@/components/Cytoscape';
import { getJson } from '@/hooks/getJson';
import type { ICytoscapeGraph } from '@/types/types';

export default function Home() {
  const initialCurrentPath = process.env.NEXT_PUBLIC_CURRENT_PATH || '';
  const [graph, setGraph] = useState<ICytoscapeGraph | null>(null);
  const [weightedGraph, setWeightedGraph] = useState<ICytoscapeGraph | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(initialCurrentPath);

  useEffect(() => {
    getJson<ICytoscapeGraph>('/api/fs/getCytoscapeGraph').then(setGraph);
    getJson<ICytoscapeGraph>('/api/fs/getWeightedCytoscapeGraph').then(setWeightedGraph);
  }, []);

  if (!graph || !weightedGraph) return;
  console.log(graph?.nodes.map(g => g.data.id));

  return (
    <>
      <header className="bg-black">
        <Breadcrumb
          path={currentPath}
          onNavigate={pkg => setCurrentPath(pkg.replace(/\./g, '/'))}
        />
      </header>
      <main>
        <Cytoscape
          elements={weightedGraph}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
      </main>
    </>
  );
}
