import { ElementsDefinition } from 'cytoscape';

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

export function filterSubPackages(elements: ElementsDefinition): ElementsDefinition {
  // 1. Extract all node packages
  const allPackages = elements.nodes.map(node => node.data.id as string);

  // 2. Filter to top-level packages
  const allowedPackages = filterPackages(allPackages);

  // 3. Keep only nodes in those packages
  const filteredNodes = elements.nodes.filter(
    node => node.data.id && allowedPackages.includes(node.data.id as string)
  );
  const allowedNodeIds = new Set(filteredNodes.map(n => n.data.id));

  // 4. Keep only edges between included nodes
  const filteredEdges = elements.edges.filter(
    edge => allowedNodeIds.has(edge.data.source) && allowedNodeIds.has(edge.data.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}
