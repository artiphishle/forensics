import { CircleLayoutOptions, NodeSingular } from 'cytoscape';

const spacingFactor = parseInt(
  process.env.NEXT_PUBLIC_SETTINGS_LAYOUT_CIRCLE_SPACINGFACTOR || '1',
  10
);

export const layout: CircleLayoutOptions = {
  // Increase the circle radius
  spacingFactor,

  avoidOverlap: true,

  fit: true,
  name: 'circle',
  padding: 30,

  // Sorts nodes alphabetically around the circle
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
