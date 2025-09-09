import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { filterByPackagePrefix } from '@/components/cytoscape/filter/filterByPackagePrefix';

describe('[filterByPackagePrefix]', () => {
  // Test: Filter by package prefix (currentPackage)
  it('Filters packages correctly by prefix', () => {
    const elements = {
      nodes: [{ data: { id: 'a.b.c' } }, { data: { id: 'a.b.c.d' } }, { data: { id: 'x.y.z' } }],
      edges: [],
    };
    const currentPackage = 'a.b.';
    const filteredElements = filterByPackagePrefix(elements, currentPackage);
    const nodeIds = filteredElements.nodes.map(({ data }) => data.id);

    expect(nodeIds.length).toBe(2);
    expect(nodeIds[0]).toBe('a.b.c');
    expect(nodeIds[1]).toBe('a.b.c.d');
  });
});
