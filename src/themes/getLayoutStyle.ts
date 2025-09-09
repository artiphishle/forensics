import type { LayoutOptions } from 'cytoscape';

import { getStyle as getBreadthfirstStyle } from '@/themes/basic/breadthfirst/style';
import { getStyle as getCircleStyle } from '@/themes/basic/circle/style';
import { getStyle as getConcentricStyle } from '@/themes/basic/concentric/style';
import { getStyle as getGridStyle } from '@/themes/basic/grid/style';
import { getStyle as getKlayStyle } from '@/themes/basic/klay/style';

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
