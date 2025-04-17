import { getEdgesFromMap } from '@/utils/cytoscape/getEdgesFromMap';
import type { NodeDefinition, EdgeDefinition, ElementsDefinition } from 'cytoscape';
import type { IFile } from '@/types/types';
import { assignPackageHierarchy } from '../java/assignPackageHierarchy';

/**
 * Builds a weighted dependency graph based on package-level imports
 */
export function buildWeightedPackageGraph(files: IFile[]) {
  const cyPkgNodesMap = new Map<string, NodeDefinition>();
  const cyPkgEdgesMap = new Map<string, EdgeDefinition['data']>(); // key = "source>target"

  for (const file of files) {
    const sourcePkg = file.package || 'undefined';
    if (!cyPkgNodesMap.has(sourcePkg))
      cyPkgNodesMap.set(sourcePkg, {
        data: { id: sourcePkg, label: sourcePkg, ...file, isIntrinsic: true },
      });

    for (const imp of file.imports) {
      const targetPkg = imp.pkg;
      if (!cyPkgNodesMap.has(targetPkg))
        cyPkgNodesMap.set(targetPkg, {
          data: {
            id: targetPkg,
            label: targetPkg,
            ...file,
            isIntrinsic: imp.isIntrinsic,
          },
        });

      const key = `${sourcePkg}>${targetPkg}`;
      if (cyPkgEdgesMap.has(key)) cyPkgEdgesMap.get(key)!.weight += 1;
      else cyPkgEdgesMap.set(key, { source: sourcePkg, target: targetPkg, weight: 1 });
    }
  }

  return {
    nodes: assignPackageHierarchy(Array.from(cyPkgNodesMap.values())),
    edges: getEdgesFromMap(cyPkgEdgesMap),
  } as ElementsDefinition;
}
