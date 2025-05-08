import type { ElementsDefinition } from 'cytoscape';

export function getMaxEdgeWeight(filteredElements: ElementsDefinition) {
  return (
    filteredElements?.edges.reduce((max, edge) => {
      return edge.data.weight > max ? edge.data.weight : max;
    }, 0) ?? 0
  );
}
