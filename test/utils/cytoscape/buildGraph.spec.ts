import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { buildGraph } from '@/utils/cytoscape/buildGraph';
import { getParsedFileStructure } from '@/utils/getParsedFileStructure';

describe('[buildGraph]', () => {
  // Test: Builds correct Cytoscape graph (nodes & edges)
  it.skip('Builds correct graph (nodes & edges)', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const graph = buildGraph(await getParsedFileStructure());

    expect(graph.nodes.length).toBe(1);
    expect(graph.edges.length).toBe(1);
  });
});
