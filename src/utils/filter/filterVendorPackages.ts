import type { ElementsDefinition } from 'cytoscape';

/**
 * Filters vendor packages by known package prefix
 */
export function filterVendorPackages(elements: ElementsDefinition): ElementsDefinition {
  const vendorPrefixes = [
    'lombok',
    'java.',
    'javax.',
    'jakarta.',
    'org.',
    'com.google.',
    'com.fasterxml.',
    'com.sun.',
    'net.',
  ];

  const isVendor = (pkg: string) => {
    return vendorPrefixes.some(prefix => pkg.startsWith(prefix));
  };

  const filteredNodes = elements.nodes.filter(node => !isVendor(node.data.id as string));
  const allowedNodeIds = new Set(filteredNodes.map(node => node.data.id));
  const filteredEdges = elements.edges.filter(
    edge => allowedNodeIds.has(edge.data.source) && allowedNodeIds.has(edge.data.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}
