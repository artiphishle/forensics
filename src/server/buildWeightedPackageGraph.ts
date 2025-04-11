'use server';

import type { IFile } from '@/types/types';

interface WeightedEdge {
  source: string;
  target: string;
  weight: number;
}

/**
 * Safely extracts the package name from an import string.
 * Handles wildcards and strips class names when needed.
 */
function extractPackageFromImport(importStr: string): string {
  const cleaned = importStr.replace(/\.\*$/, ''); // remove trailing .* if present
  const segments = cleaned.split('.');

  if (segments.length < 2) return cleaned;

  // Walk backward and drop class-like segments
  let lastIndex = segments.length;
  while (lastIndex > 0 && /^[A-Z][a-zA-Z0-9]*$/.test(segments[lastIndex - 1])) {
    lastIndex--;
  }

  return segments.slice(0, lastIndex).join('.') || '__root__';
}

/**
 * Builds a weighted dependency graph based on package-level imports.
 */
export async function buildWeightedPackageGraph(files: IFile[]) {
  const packageSet = new Set<string>();
  const edgeMap = new Map<string, WeightedEdge>(); // key = "source>target"

  for (const file of files) {
    const sourcePkg = file.package || '__root__';
    if (!file.package) console.error('NO PACKAGE:', file.path);
    packageSet.add(sourcePkg);

    const importedPackages = new Set(
      file.imports.map(extractPackageFromImport).filter(pkg => pkg && pkg !== sourcePkg)
    );

    for (const targetPkg of importedPackages) {
      packageSet.add(targetPkg);

      const key = `${sourcePkg}>${targetPkg}`;
      if (edgeMap.has(key)) {
        edgeMap.get(key)!.weight += 1;
      } else {
        edgeMap.set(key, { source: sourcePkg, target: targetPkg, weight: 1 });
      }
    }
  }

  const nodes = Array.from(packageSet).map(pkg => ({
    data: {
      id: pkg,
      label: pkg.split('.').pop() || pkg,
      selectable: true,
    },
  }));

  const edges = Array.from(edgeMap.values()).map(edge => ({
    data: {
      source: edge.source,
      target: edge.target,
      weight: edge.weight,
      label: `${edge.weight}`,
    },
  }));

  return { nodes, edges };
}
