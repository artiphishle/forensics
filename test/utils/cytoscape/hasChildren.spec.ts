import { hasChildren } from '@/utils/cytoscape/hasChildren';
import { NodeDefinition } from 'cytoscape';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';

describe('[hasChildren]', () => {
  it('returns correct children count of a node', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const nodes: NodeDefinition[] = [{ data: { id: 'com' } }, { data: { id: 'com.java' } }];

    expect(hasChildren(nodes[0], nodes)).toBe(true);
  });
});
