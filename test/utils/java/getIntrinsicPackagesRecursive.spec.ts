import { resolve } from 'path';
import { getIntrinsicPackagesRecursive } from '@/utils/java/getIntrinsicPackagesRecursive';
import assert from 'node:assert';
import test, { describe } from 'node:test';

describe('[getIntrinsicPackagesRecursive]', () => {
  test('Finds "com" package and all sub packages', async () => {
    const projectPath = resolve(process.cwd(), 'examples/java/my-app');
    const intrinsicPackages = await getIntrinsicPackagesRecursive(projectPath);

    assert.strictEqual(intrinsicPackages.length, 4);
    assert.strictEqual(intrinsicPackages[0], 'com.example.myapp.a');
    assert.strictEqual(intrinsicPackages[1], 'com.example.myapp.b');
    assert.strictEqual(intrinsicPackages[2], 'com.example.myapp.c');
    assert.strictEqual(intrinsicPackages[3], 'com.example.myapp.d');
  });
});
