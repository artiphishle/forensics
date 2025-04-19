import assert from 'node:assert';
import test, { describe } from 'node:test';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';

describe('[filterByPackagePrefix]', () => {
  // Test: Filter by package prefix (currentPackage)
  test('Filters packages correctly by prefix', () => {
    const elements = {
      nodes: [{ data: { id: 'a.b.c' } }, { data: { id: 'a.b.c.d' } }, { data: { id: 'x.y.z' } }],
      edges: [],
    };
    const currentPackage = 'a.b.';
    const filteredElements = filterByPackagePrefix(elements, currentPackage);
    const nodeIds = filteredElements.nodes.map(({ data }) => data.id);

    assert.strictEqual(nodeIds.length, 2);
    assert.strictEqual(nodeIds[0], 'a.b.c');
    assert.strictEqual(nodeIds[1], 'a.b.c.d');
  });
});
