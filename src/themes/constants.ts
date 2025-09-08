import type { LayoutOptions } from 'cytoscape';
import type { CytoscapeLayout } from '@/themes/types';

import { layout as breadthfirstLayout } from '@/themes/basic/breadthfirst/layout';
import { layout as circleLayout } from '@/themes/basic/circle/layout';
import { layout as concentricLayout } from '@/themes/basic/concentric/layout';
import { layout as gridLayout } from '@/themes/basic/grid/layout';
import { layout as klayLayout } from '@/themes/basic/klay/layout';

export const LAYOUTS: Record<CytoscapeLayout, LayoutOptions> = {
  breadthfirst: breadthfirstLayout,
  circle: circleLayout,
  concentric: concentricLayout,
  grid: gridLayout,
  klay: klayLayout,
} as const;
