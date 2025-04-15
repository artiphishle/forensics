import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';
import { findEntryPoint } from '@/utils/java/findEntryPoint';

export async function generateSequenceFromProject(
  projectRoot: string = process.env.NEXT_PUBLIC_PROJECT_PATH || ''
) {
  const parsed = await getAllFilesRecursive(projectRoot);
  const entry = findEntryPoint(parsed);

  if (!entry) {
    return `sequenceDiagram\n  Note over App: No main() method found.`;
  }

  const fileMap = new Map(parsed.map(file => [file.className, file]));
  const seen = new Set<string>();
  const callGraph: ICall[] = [];

  function walk(className: string) {
    const file = fileMap.get(className);
    if (!file) return;

    for (const call of file.calls) {
      const key = `${className}->${call.callee}.${call.method}`;
      if (!seen.has(key)) {
        callGraph.push({ from: className, to: call.callee, method: call.method });
        seen.add(key);
        walk(call.callee);
      }
    }
  }

  walk(entry.className);

  // Mermaid generation
  const lines: string[] = ['sequenceDiagram', `actor User`, `User->>${entry.className}: main()`];
  callGraph.forEach(({ from, to, method }) => {
    lines.push(`${from}->>${to}: ${method}()`);
  });

  return lines.join('\n');
}

interface ICall {
  readonly from: string;
  readonly to: string;
  readonly method: string;
}
