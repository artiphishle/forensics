import { NodeSingular } from 'cytoscape';

export const layout = {
  name: 'grid',
  fit: true,
  padding: 30, // Add some space around the graph
  avoidOverlap: true,
  // This is the key: sort nodes alphabetically by their ID
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
