import type { ElementsDefinition } from 'cytoscape';
import type { IDirectory, IFile } from '@/types/types';

/**
 * Finds cyclic packages using Tarjan's algorithm
 */
export function getCyclicPackages(root: IDirectory): Set<string> {
  const files: IFile[] = [];

  function collectFiles(dir: IDirectory) {
    for (const key in dir) {
      const entry = dir[key];
      if ('path' in entry && 'package' in entry) {
        files.push(entry as IFile);
      } else {
        collectFiles(entry as IDirectory);
      }
    }
  }

  collectFiles(root);

  const graph = new Map<string, Set<string>>();

  for (const file of files) {
    const fromPkg = file.package;
    if (!graph.has(fromPkg)) graph.set(fromPkg, new Set());

    for (const imp of file.imports) {
      if (imp.pkg !== fromPkg) graph.get(fromPkg)!.add(imp.pkg);
    }
  }

  // Tarjan’s algorithm
  let index = 0;
  const indexes = new Map<string, number>();
  const lowlinks = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const sccs: string[][] = [];

  function strongConnect(pkg: string) {
    indexes.set(pkg, index);
    lowlinks.set(pkg, index);
    index++;
    stack.push(pkg);
    onStack.add(pkg);

    const neighbors = graph.get(pkg) || new Set();
    for (const neighbor of neighbors) {
      if (!indexes.has(neighbor)) {
        strongConnect(neighbor);
        lowlinks.set(pkg, Math.min(lowlinks.get(pkg)!, lowlinks.get(neighbor)!));
      } else if (onStack.has(neighbor)) {
        lowlinks.set(pkg, Math.min(lowlinks.get(pkg)!, indexes.get(neighbor)!));
      }
    }

    if (lowlinks.get(pkg) === indexes.get(pkg)) {
      const scc: string[] = [];
      let w;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        scc.push(w);
      } while (w !== pkg);

      if (scc.length > 1 || (scc.length === 1 && graph.get(scc[0])?.has(scc[0]))) {
        sccs.push(scc);
      }
    }
  }

  for (const pkg of graph.keys()) {
    if (!indexes.has(pkg)) {
      strongConnect(pkg);
    }
  }

  return new Set(sccs.flat());
}

/**
 * Marks cyclic packages
 */
export function markCyclicPackages(elements: ElementsDefinition, files: IDirectory) {
  const cyclicPackages = getCyclicPackages(files);
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
