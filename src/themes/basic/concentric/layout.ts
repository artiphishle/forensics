import { ConcentricLayoutOptions } from 'cytoscape';

export const layout: ConcentricLayoutOptions = {
  avoidOverlap: true,

  fit: true,
  name: 'concentric',
  padding: 30,

  // Increase the circle radius
  spacingFactor: 1.5,
};
