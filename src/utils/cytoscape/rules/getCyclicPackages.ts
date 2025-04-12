import { extractJavaPackageFromImport } from '@/utils/java/extractJavaPackageFromImport';

export function getCyclicPackages(files: { package: string; imports: string[] }[]): Set<string> {
  const graph = new Map<string, Set<string>>();

  for (const file of files) {
    const fromPkg = file.package;
    if (!graph.has(fromPkg)) graph.set(fromPkg, new Set());

    for (const imp of file.imports) {
      const toPkg = extractJavaPackageFromImport(imp);
      if (toPkg !== fromPkg) {
        graph.get(fromPkg)!.add(toPkg);
      }
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

    const neighbors = graph.get(pkg) || [];
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

  console.log(sccs.flat());
  return new Set(sccs.flat());
}
