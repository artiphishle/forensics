import test, { describe } from 'node:test';
import assert from 'node:assert';
import {
  extractJavaPackageFromImport,
  extractJavaPackageFromReversedImportArray,
} from '@/utils/java/extractJavaPackageFromImport';

describe('[extractJavaPackageFromReversedImportArray]', () => {
  // Helper that resolves package from reversed import array
  test('Extracts correct package from reversed import array', () => {
    const t = { in: 'com.java.A'.split('.').reverse(), out: 'com.java' };
    const result = extractJavaPackageFromReversedImportArray(t.in);
    assert.strictEqual(result, t.out);
  });
});

describe('[extractJavaPackageFromImport]', () => {
  // Resolve package from normal class import
  test('Extracts correct package from import', () => {
    const t = { in: 'com.java.A', out: 'com.java' };
    const result = extractJavaPackageFromImport(t.in);
    assert.strictEqual(result, t.out);
  });

  // Resolve package from nested class import
  test('Extracts correct package from nested import', () => {
    const t = { in: 'com.java.A.B', out: 'com.java' };
    const result = extractJavaPackageFromImport(t.in);
    assert.strictEqual(result, t.out);
  });
});
