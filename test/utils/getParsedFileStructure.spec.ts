import { getParsedFileStructure, IDirectory } from '@/utils/getParsedFileStructure';
import assert from 'node:assert';
import { resolve } from 'node:path';
import test, { describe } from 'node:test';

describe('[getParsedFileStructure]', () => {
  // Test reading a Java project structure recursively
  test('Reads .java project structure correctly', async () => {
    const parsedFileStructure = await getParsedFileStructure(
      resolve(process.cwd(), 'examples/java/my-app')
    );
    const comExampleMyapp = ((parsedFileStructure.com as IDirectory).example as IDirectory)
      .myapp as IDirectory;
    const comExampleMyappA = comExampleMyapp.a as IDirectory;
    const comExampleMyappB = comExampleMyapp.b as IDirectory;
    const comExampleMyappC = comExampleMyapp.c as IDirectory;
    const comExampleMyappD = comExampleMyapp.d as IDirectory;

    assert.strictEqual(comExampleMyapp['App.java'].className, 'App');
    assert.strictEqual(comExampleMyappA['A.java'].className, 'A');
    assert.strictEqual(comExampleMyappB['B.java'].className, 'B');
    assert.strictEqual(comExampleMyappC['C.java'].className, 'C');
    assert.strictEqual(comExampleMyappD['D.java'].className, 'D');
  });
});
