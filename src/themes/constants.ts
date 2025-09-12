import type { LayoutOptions } from 'cytoscape';

import {
  breadthfirstLayout,
  circleLayout,
  concentricLayout,
  gridLayout,
  klayLayout,
} from '@/themes';

export const LAYOUTS: Record<LayoutOptions['name'], LayoutOptions> = {
  breadthfirst: breadthfirstLayout,
  circle: circleLayout,
  concentric: concentricLayout,
  grid: gridLayout,
  klay: klayLayout,
} as const;
