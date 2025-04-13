import { extractJavaPackageFromImport } from '@/utils/java/extractJavaPackageFromImport';
import { getNodesFromSet } from '@/utils/cytoscape/getNodesFromSet';
import { getEdgesFromMap } from '@/utils/cytoscape/getEdgesFromMap';
import type { EdgeDefinition, ElementsDefinition } from 'cytoscape';
import type { IFile } from '@/types/types';
import { assignPackageHierarchy } from '../java/assignPackageHierarchy';

/**
 * Builds a weighted dependency graph based on package-level imports
 */
export function buildWeightedPackageGraph(files: IFile[]) {
  const cyPkgNodesSet = new Set<string>();
  const cyPkgEdgesMap = new Map<string, EdgeDefinition['data']>(); // key = "source>target"

  for (const file of files) {
    const sourcePkg = file.package || 'undefined';
    cyPkgNodesSet.add(extractJavaPackageFromImport(sourcePkg));

    const packageImportedSet = new Set<string>();
    for (const imp of file.imports) {
      const pkgFromImport = extractJavaPackageFromImport(imp);
      if (pkgFromImport !== sourcePkg) packageImportedSet.add(pkgFromImport);
    }

    for (const targetPkg of packageImportedSet) {
      cyPkgNodesSet.add(targetPkg);

      const key = `${sourcePkg}>${targetPkg}`;
      if (cyPkgEdgesMap.has(key)) cyPkgEdgesMap.get(key)!.weight += 1;
      else cyPkgEdgesMap.set(key, { source: sourcePkg, target: targetPkg, weight: 1 });
    }
  }

  return {
    nodes: assignPackageHierarchy(getNodesFromSet(cyPkgNodesSet)),
    edges: getEdgesFromMap(cyPkgEdgesMap),
  } as ElementsDefinition;
}
