import { parseJavaFile } from '@/utils/java/parseJavaFile';
import assert from 'node:assert';
import { resolve } from 'node:path';
import test, { describe } from 'node:test';

describe('[parseJavaFile]', () => {
  // Test: Parse a java file correctly
  test('Parses a .java file correctly', async () => {
    const projectRoot = resolve(process.cwd(), 'examples/java/my-app');
    const javaFile = resolve(projectRoot, 'src/main/java/com/example/myapp/App.java');
    const parsedJavaFile = await parseJavaFile(javaFile, projectRoot);

    assert.strictEqual(parsedJavaFile.className, 'App');
    assert.strictEqual(parsedJavaFile.imports.length, 1);
    assert.strictEqual(parsedJavaFile.methods.length, 1);
    assert.strictEqual(parsedJavaFile.package, 'com.example.myapp');
    assert.strictEqual(parsedJavaFile.path, 'src/main/java/com/example/myapp/App.java');
  });
});
