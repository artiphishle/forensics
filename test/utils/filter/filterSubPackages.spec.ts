import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { filterSubPackages } from '@/utils/filter/filterSubPackages';
import type { ElementsDefinition } from 'cytoscape';

describe('[filterSubPackages]', () => {
  // Test: Containing packages filtered corectly
  it('Filters sub-packages correctly', () => {
    const elements: ElementsDefinition = {
      nodes: [{ data: { id: 'a.b' } }, { data: { id: 'a.b.c' } }, { data: { id: 'x.y.z' } }],
      edges: [],
    };
    const filteredElements = filterSubPackages(elements);
    const nodeIds = filteredElements.nodes.map(({ data }) => data.id);

    expect(nodeIds.length).toBe(2);
    expect(nodeIds[0]).toBe('a.b');
    expect(nodeIds[1]).toBe('x.y.z');
  });
});
