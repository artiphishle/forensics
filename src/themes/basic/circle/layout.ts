import { NodeSingular } from 'cytoscape';

export const layout = {
  avoidOverlap: true,

  // Add 20px buffer around each node
  avoidOverlapPadding: 20,

  fit: true,
  name: 'circle',
  padding: 30,

  // Increase the circle radius
  spacingFactor: 1.5,

  // Sorts nodes alphabetically around the circle
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
