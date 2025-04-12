import { markCyclingDependencies } from '@/utils/cytoscape/rules/markCyclingDependencies';
import { ElementsDefinition } from 'cytoscape';

const elements: ElementsDefinition = {
  nodes: [
    { data: { id: 'A' } },
    { data: { id: 'B' } },
    { data: { id: 'C' } },
    { data: { id: 'D' } },
  ],
  edges: [
    { data: { id: 'e1', source: 'A', target: 'B' } },
    { data: { id: 'e2', source: 'B', target: 'C' } },
    { data: { id: 'e3', source: 'C', target: 'A' } }, // A-B-C-A cycle ✅
    { data: { id: 'e4', source: 'D', target: 'A' } }, // outside the cycle ❌
  ],
};

const marked = markCyclingDependencies(elements);

marked.edges.forEach(e => console.log(e));
