import { EdgeDefinition, ElementsDefinition } from 'cytoscape';

/**
 * Filters sub packages to only show top level packages
 * @example ['x.y', 'x.y.z', 'a', 'a.c.x'] => ['x.y', 'a']
 */
function filterPackages(packages: string[]): string[] {
  const sorted = [...packages].sort(); // Ensures parent packages come before children
  const result: string[] = [];

  for (const pkg of sorted) {
    if (!result.some(parent => pkg.startsWith(parent + '.'))) {
      result.push(pkg);
    }
  }

  return result;
}

export function filterSubPackages(
  elements: ElementsDefinition,
  allowSelfLoops: boolean = false
): ElementsDefinition {
  const allPackages = elements.nodes.map(node => node.data.id as string);

  // Step 1: Identify top-level packages
  const topLevelPackages = filterPackages(allPackages);
  const topLevelSet = new Set(topLevelPackages);

  // Step 2: Map each package to its closest visible ancestor
  const packageToAncestor = new Map<string, string>();
  for (const pkg of allPackages) {
    if (topLevelSet.has(pkg)) {
      packageToAncestor.set(pkg, pkg);
    } else {
      const parts = pkg.split('.');
      while (parts.length > 1) {
        parts.pop();
        const ancestor = parts.join('.');
        if (topLevelSet.has(ancestor)) {
          packageToAncestor.set(pkg, ancestor);
          break;
        }
      }
    }
  }

  // Step 3: Keep only visible nodes
  const filteredNodes = elements.nodes.filter(n => topLevelSet.has(n.data.id!));
  const visibleNodeIds = new Set(filteredNodes.map(n => n.data.id));

  // Step 4: Lift and aggregate edges (summing weights)
  const edgeMap = new Map<string, EdgeDefinition>();

  for (const edge of elements.edges) {
    const rawSource = edge.data.source;
    const rawTarget = edge.data.target;

    const liftedSource = packageToAncestor.get(rawSource) ?? rawSource;
    const liftedTarget = packageToAncestor.get(rawTarget) ?? rawTarget;

    if (!visibleNodeIds.has(liftedSource) || !visibleNodeIds.has(liftedTarget)) {
      continue; // Skip edges involving invisible nodes
    }

    if (!allowSelfLoops && liftedSource === liftedTarget) {
      continue; // Skip self-loops if not allowed
    }

    const key = `${liftedSource}->${liftedTarget}`;
    if (!edgeMap.has(key)) {
      // Clone edge and override source/target
      edgeMap.set(key, {
        ...edge,
        data: {
          ...edge.data,
          source: liftedSource,
          target: liftedTarget,
        },
      });
    } else {
      const edge = edgeMap.get(key);
      if (!edge) throw new Error(`Edge not found with key: '${key}'`);

      // Sum weight
      edge.data.weight += edge.data.weight || 1;
    }
  }

  const filteredEdges = Array.from(edgeMap.values());

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}
