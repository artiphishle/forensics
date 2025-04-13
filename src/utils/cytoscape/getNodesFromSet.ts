import { NodeDefinition } from 'cytoscape';

export function getNodesFromSet(cyPkgNodesSet: Set<string>) {
  const cyPkgNodesArray = Array.from(cyPkgNodesSet);
  const nodes: NodeDefinition[] = cyPkgNodesArray.map(pkg => ({
    data: { id: pkg, label: pkg.split('.').pop() },
  }));

  return nodes;
}
