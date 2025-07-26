import { GridLayoutOptions, NodeSingular } from 'cytoscape';

const spacingFactor = parseInt(
  process.env.NEXT_PUBLIC_SETTINGS_LAYOUT_CIRCLE_SPACINGFACTOR || '1',
  10
);

export const layout: GridLayoutOptions = {
  spacingFactor,

  name: 'grid',
  fit: true,
  padding: 30, // Add some space around the graph
  avoidOverlap: true,

  // Sort nodes alphabetically by their ID
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
