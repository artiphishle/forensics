import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { parseJavaFile } from '@/app/api/fs/utils/parser/java/parseJavaFile';

describe('[parseJavaFile]', () => {
  // Test: Parse a java file correctly
  it('parses a .java file correctly', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
    if (!projectPath) throw new Error('no project env');

    const javaFile = resolve(projectPath, 'src/main/java/com/example/myapp/App.java');
    const parsedJavaFile = await parseJavaFile(javaFile, projectPath);

    expect(parsedJavaFile.className).toBe('App');
    expect(parsedJavaFile.imports.length).toBe(1);
    expect(parsedJavaFile.methods.length).toBe(1);
    expect(parsedJavaFile.package).toBe('com.example.myapp');
    expect(parsedJavaFile.path).toBe('src/main/java/com/example/myapp/App.java');
  });
});
