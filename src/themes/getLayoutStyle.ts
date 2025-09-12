import type { LayoutOptions } from 'cytoscape';

import { getStyle as getBreadthfirstStyle } from '@/themes/breadthfirst/style';
import { getStyle as getCircleStyle } from '@/themes/circle/style';
import { getStyle as getConcentricStyle } from '@/themes/concentric/style';
import { getStyle as getGridStyle } from '@/themes/grid/style';
import { getStyle as getKlayStyle } from '@/themes/klay/style';

export function getLayoutStyle(cytoscapeLayout: LayoutOptions['name']) {
  switch (cytoscapeLayout) {
    case 'breadthfirst':
      return getBreadthfirstStyle();
    case 'circle':
      return getCircleStyle();
    case 'concentric':
      return getConcentricStyle();
    case 'grid':
      return getGridStyle();
    case 'klay':
      return getKlayStyle();
  }
}
