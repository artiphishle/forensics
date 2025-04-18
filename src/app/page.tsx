'use client';
import { useEffect, useState } from 'react';
import { ElementsDefinition } from 'cytoscape';
import Breadcrumb from '@/components/Breadcrumb';
import Cytoscape from '@/components/views/PackageView';
import { getJson } from '@/hooks/getJson';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Loader from '@/components/Loader';

export default function Home() {
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const [currentPackage, setCurrentPackage] = useState<string>('');

  useEffect(() => {
    getJson<ElementsDefinition>('/api/fs/getGraph').then(setPackageGraph);
  }, []);

  if (!packageGraph) return <Loader />;

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
          elements={packageGraph}
          currentPackage={currentPackage}
          setCurrentPackage={setCurrentPackage}
        />
      </Main>
    </>
  );
}
