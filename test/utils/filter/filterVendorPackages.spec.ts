import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';
import { ElementsDefinition } from 'cytoscape';
import assert from 'node:assert';
import test, { describe } from 'node:test';

describe('[filterVendorPackages]', () => {
  test('filter vendor packages by known prefixes', () => {
    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'lombok' } },
        { data: { id: 'com.myapp.service' } },
        { data: { id: 'org.springframework.context' } },
        { data: { id: 'java.util' } },
        { data: { id: 'javax.util' } },
        { data: { id: 'jakarta.util' } },
        { data: { id: 'com.google.util' } },
        { data: { id: 'com.fasterxml.util' } },
        { data: { id: 'com.sun.util' } },
        { data: { id: 'net.util' } },
      ],
      edges: [],
    };
    const result = filterVendorPackages(elements);
    assert.strictEqual(result.nodes.length, 1);
    assert.strictEqual(result.nodes[0].data.id, 'com.myapp.service');
  });
});
