import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from 'testosterone/src/matchers';
import { generateSequenceFromProject } from '@/utils/mermaid/generateSequenceFromProject';

describe('[generateSequenceFromProject]', () => {
  // Test: Generates correct sequence diagram
  it('generates correct sequence diagram', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const sequence = await generateSequenceFromProject();

    expect(sequence).toBe('sequenceDiagram\nactor User\nUser->>App: main()\nApp->>out: println()');
  });
});
