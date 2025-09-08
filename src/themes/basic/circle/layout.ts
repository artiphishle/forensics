import { CircleLayoutOptions, NodeSingular } from 'cytoscape';

export const layout: CircleLayoutOptions = {
  avoidOverlap: true,

  fit: true,
  name: 'circle',
  padding: 30,

  // Sorts nodes alphabetically around the circle
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
