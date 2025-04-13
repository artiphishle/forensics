'use client';
import { useEffect, useState } from 'react';
import { ElementsDefinition } from 'cytoscape';
import Breadcrumb from '@/components/Breadcrumb';
import Cytoscape from '@/components/views/PackageView';
import { getJson } from '@/hooks/getJson';
import Header from '@/components/Header';
import Main from '@/components/Main';
import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';

export default function Home() {
  // const initialCurrentPackage = process.env.NEXT_PUBLIC_CURRENT_PACKAGE || '';
  // const [graph, setGraph] = useState<ICytoscapeGraph | null>(null);
  const [weightedGraph, setWeightedGraph] = useState<ElementsDefinition | null>(null);
  const [currentPackage, setCurrentPackage] = useState<string | null>(null);

  useEffect(() => {
    getJson<string>('/api/getEntryPoint').then(setCurrentPackage);
    // getJson<ICytoscapeGraph>('/api/fs/getCytoscapeGraph').then(setGraph);
    getJson<ElementsDefinition>('/api/fs/getWeightedCytoscapeGraph').then(setWeightedGraph);
  }, []);

  if (!weightedGraph || !currentPackage) return;

  return (
    <>
      <Header title="Packages">
        <Breadcrumb
          path={currentPackage.replace(/\./g, '/')}
          onNavigate={(path: string) => setCurrentPackage(path.replace(/\//g, '.'))}
        />
      </Header>
      <Main>
        <Cytoscape
          elements={weightedGraph}
          currentPackage={currentPackage}
          setCurrentPackage={setCurrentPackage}
        />
      </Main>
    </>
  );
}
