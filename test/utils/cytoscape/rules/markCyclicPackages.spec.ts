import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { getCyclicPackageSet } from '@/utils/cytoscape/rules/markCyclicPackages';
import { getParsedFileStructure } from '@/utils/getParsedFileStructure';

describe('[getCyclicPackageSet]', () => {
  it('Marks package cycle: A-B-A using nested directory structure', async () => {
    const projectPath = (process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(
      process.cwd(),
      'examples/java/my-app'
    ));

    const result = getCyclicPackageSet(await getParsedFileStructure(projectPath));
    const cyclic = Array.from(result);

    expect(cyclic.length).toBe(2);
    expect(cyclic.sort()).toEqual(['com.example.myapp.a', 'com.example.myapp.b']);
  });
});
