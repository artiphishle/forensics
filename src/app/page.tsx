'use client';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import ZoomInput from '@/components/ZoomInput';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Loader from '@/components/Loader';
import { getJson } from '@/hooks/getJson';
import { useCytograph } from '@/hooks/useCytoscape';
import type { ElementsDefinition } from 'cytoscape';

export default function Home() {
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const { cyRef, cyInstance } = useCytograph(packageGraph, currentPackage, setCurrentPackage);

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
        <div className="flex flex-col w-full flex-1 gap-2">
          <div ref={cyRef} className="h-[calc(100%-65px)]" />
          <ZoomInput cyInstance={cyInstance} />
        </div>
      </Main>
    </>
  );
}
