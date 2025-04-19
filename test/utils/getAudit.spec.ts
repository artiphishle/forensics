import assert from 'node:assert';
import test, { describe } from 'node:test';
import { getAudit } from '@/utils/getAudit';
import { resolve } from 'node:path';
import { IFile } from '@/types/types';

describe('[getAudit]', () => {
  // Test: Audit output contains 'App.java' which is matched correctly, also audit.meta is correct
  test('Genrates correct Audit (App.java & meta property)', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const audit = await getAudit();
    const appJava = {
      calls: [
        {
          callee: 'out',
          method: 'println',
        },
      ],
      className: 'App',
      imports: [
        {
          isIntrinsic: true,
          name: 'com.example.myapp.a.A',
          pkg: 'com.example.myapp.a',
        },
      ],
      methods: [
        {
          name: 'main',
          parameters: ['String[] args'],
          returnType: 'void',
          visibility: 'public',
        },
      ],
      package: 'com.example.myapp',
      path: 'App.java',
    };
    const auditAppJava = (audit as any).files.com.example.myapp['App.java'] as IFile;

    // audit.files > File 'App.java'
    assert.strictEqual(auditAppJava.className, appJava.className);

    assert.strictEqual(auditAppJava.calls[0].callee, appJava.calls[0].callee);
    assert.strictEqual(auditAppJava.calls[0].method, appJava.calls[0].method);

    assert.strictEqual(auditAppJava.imports[0].isIntrinsic, appJava.imports[0].isIntrinsic);
    assert.strictEqual(auditAppJava.imports[0].name, appJava.imports[0].name);
    assert.strictEqual(auditAppJava.imports[0].pkg, appJava.imports[0].pkg);

    assert.strictEqual(auditAppJava.methods[0].name, appJava.methods[0].name);
    assert.strictEqual(auditAppJava.methods[0].parameters[0], appJava.methods[0].parameters[0]);
    assert.strictEqual(auditAppJava.methods[0].returnType, appJava.methods[0].returnType);
    assert.strictEqual(auditAppJava.methods[0].visibility, appJava.methods[0].visibility);

    assert.strictEqual(auditAppJava.package, appJava.package);
    assert.strictEqual(auditAppJava.path, appJava.path);

    // audit.meta
    assert.strictEqual(audit.meta.language.language, 'java');
    assert.strictEqual(audit.meta.projectName, 'my-app');
    assert.strictEqual(typeof audit.meta.timeStart, 'number');
    assert.strictEqual(typeof audit.meta.timeEnd, 'number');
  });
});
