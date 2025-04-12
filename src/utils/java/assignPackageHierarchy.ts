import { NodeDefinition } from 'cytoscape';

/**
 * Assign 'isParent' to nodes (use hiearchy in the flat structure)
 * @example 'com.java' is the parent of 'com.java.util'
 */
export function assignPackageHierarchy(nodes: NodeDefinition[]) {
  const idMap = new Map(nodes.map(n => [n.data.id, n]));

  // Track which nodes are parents
  const parentIds = new Set();

  // Go through each node and figure out its logical parent (based on ID structure)
  for (const node of nodes) {
    const parts = (node.data.id as string).split('.');

    for (let i = parts.length - 1; i > 0; i--) {
      const potentialParentId = parts.slice(0, i).join('.');
      if (idMap.has(potentialParentId)) {
        parentIds.add(potentialParentId); // track parent ID
        break;
      }
    }
  }

  // Mark nodes as isParent: true if they were identified as a parent
  for (const id of parentIds) {
    const node = idMap.get(id as string);
    if (node) {
      node.data.isParent = true;
    }
  }

  return nodes;
}
