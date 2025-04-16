'use client';
import { ElementsDefinition } from 'cytoscape';
import { useCytograph } from '@/hooks/useCytoscape';
import ZoomInput from '@/components/ZoomInput';

interface ICytograph {
  readonly currentPackage: string;
  readonly setCurrentPackage: (path: string) => void;
  readonly elements: ElementsDefinition;
}

export default function Cytograph({ elements, currentPackage, setCurrentPackage }: ICytograph) {
  const { cyRef, cyInstance } = useCytograph(elements, currentPackage, setCurrentPackage);

  return (
    <div className="flex flex-col w-full flex-1 gap-2">
      <div ref={cyRef} className="h-[calc(100%-65px)]" />
      <ZoomInput cyInstance={cyInstance} />
    </div>
  );
}
