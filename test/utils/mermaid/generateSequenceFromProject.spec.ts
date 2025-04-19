import { generateSequenceFromProject } from '@/utils/mermaid/generateSequenceFromProject';
import assert from 'node:assert';
import { resolve } from 'node:path';
import test, { describe } from 'node:test';

describe('[generateSequenceFromProject]', () => {
  // Test: Generates correct sequence diagram
  test('Correct sequence diagram is generated', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');
    const sequence = await generateSequenceFromProject();

    assert.strictEqual(
      sequence,
      'sequenceDiagram\nactor User\nUser->>App: main()\nApp->>out: println()'
    );
  });
});
