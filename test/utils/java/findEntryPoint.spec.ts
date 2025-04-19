import { findEntryPoint } from '@/utils/java/findEntryPoint';
import assert from 'node:assert';
import { resolve } from 'node:path';
import test, { describe } from 'node:test';
import { getParsedFileStructure } from '@/utils/getParsedFileStructure';
import type { IDirectory, IFile } from '@/types/types';

function collectFilesFromDirectory(dir: IDirectory): IFile[] {
  const files: IFile[] = [];

  function traverse(current: IDirectory) {
    for (const key in current) {
      const entry = current[key];
      if ('path' in entry && 'package' in entry) {
        files.push(entry as IFile);
      } else {
        traverse(entry as IDirectory);
      }
    }
  }

  traverse(dir);
  return files;
}

describe('[findEntryPoint]', () => {
  // Test: Finds first public static void main
  test('Finds first public static void main', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const parsedFileStructure = await getParsedFileStructure();
    const files = collectFilesFromDirectory(parsedFileStructure);
    const entryPoint = findEntryPoint(files);

    assert.strictEqual(entryPoint?.className, 'App');
  });
});
