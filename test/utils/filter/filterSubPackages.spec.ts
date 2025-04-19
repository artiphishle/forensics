import assert from 'node:assert';
import test, { describe } from 'node:test';
import { filterSubPackages } from '@/utils/filter/filterSubPackages';
import type { ElementsDefinition } from 'cytoscape';

describe('[filterSubPackages]', () => {
  // Test: Containing packages filtered corectly
  test('Filters sub-packages correctly', () => {
    const elements: ElementsDefinition = {
      nodes: [{ data: { id: 'a.b' } }, { data: { id: 'a.b.c' } }, { data: { id: 'x.y.z' } }],
      edges: [],
    };
    const filteredElements = filterSubPackages(elements);
    const nodeIds = filteredElements.nodes.map(({ data }) => data.id);

    assert.strictEqual(nodeIds.length, 2);
    assert.strictEqual(nodeIds[0], 'a.b');
    assert.strictEqual(nodeIds[1], 'x.y.z');
  });
});
