import { NodeSingular } from 'cytoscape';

export const layout = {
  name: 'circle',
  fit: true,
  padding: 30,
  avoidOverlap: true,
  // Sorts nodes alphabetically around the circle
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
