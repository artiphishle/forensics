import type { LayoutOptions } from 'cytoscape';

export const CYTOSCAPE_LAYOUTS: LayoutOptions['name'][] = [
  'breadthfirst',
  'circle',
  'concentric',
  'grid',
  'klay',
] as const;
