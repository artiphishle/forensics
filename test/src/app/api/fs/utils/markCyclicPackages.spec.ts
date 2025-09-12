import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { getParsedFileStructure } from '@/app/api/fs/utils/getParsedFileStructure';
import { buildGraph } from '@/app/api/fs/utils/buildGraph';
import { getCyclicPackageSet } from '@/app/api/fs/utils/markCyclicPackages';

describe('[getCyclicPackageSet]', () => {
  it('Marks package cycle: A-B-A using nested directory structure', async () => {
    const projectPath = (process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(
      process.cwd(),
      'examples/java/my-app'
    ));

    const files = await getParsedFileStructure(projectPath);
    const result = getCyclicPackageSet(files, buildGraph(files));
    const cyclic = Array.from(result);

    expect(cyclic.length).toBe(2);
    expect(cyclic.sort()).toEqual(['com.example.myapp.a', 'com.example.myapp.b']);
  });
});
