import { ElementsDefinition } from 'cytoscape';
import { getCyclicPackages } from './getCyclicPackages';
import { IFile } from '@/types/types';

export function markCyclicPackages(elements: ElementsDefinition, files: IFile[]) {
  const cyclicPackages = getCyclicPackages(files); // returns Set<string> of cyclic packages

  // To mark nodes:
  const nodes = elements.nodes.map(node => {
    const pkg = node.data.id as string;
    const isCyclic = cyclicPackages.has(pkg);
    return {
      ...node,
      classes: isCyclic ? 'packageCycle' : '',
      data: { ...node.data, packageCycle: isCyclic },
    };
  });

  return { ...elements, nodes };
}
