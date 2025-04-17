import { ElementsDefinition } from 'cytoscape';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';
import { resolve } from 'node:path';

describe('[filterVendorPackages]', () => {
  test('filter vendor packages (not in src/main/java)', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'lombok' } },
        { data: { id: 'java.util' } },
        { data: { id: 'javax.util' } },
        { data: { id: 'org.springframework.context' } },
        { data: { id: 'com.google.util' } },
        { data: { id: 'com.example.myapp.a', isIntrinsic: true } },
        { data: { id: 'com.example.myapp.b', isIntrinsic: true } },
        { data: { id: 'com.example.myapp.c', isIntrinsic: true } },
        { data: { id: 'com.example.myapp.d', isIntrinsic: true } },
      ],
      edges: [],
    };
    const result = filterVendorPackages(elements);
    assert.strictEqual(result.nodes.length, 4); // wrong: com.google not filtered
    assert.strictEqual(result.nodes[0].data.id, 'com.example.myapp.a');
    assert.strictEqual(result.nodes[1].data.id, 'com.example.myapp.b');
    assert.strictEqual(result.nodes[2].data.id, 'com.example.myapp.c');
    assert.strictEqual(result.nodes[3].data.id, 'com.example.myapp.d');
  });
});
