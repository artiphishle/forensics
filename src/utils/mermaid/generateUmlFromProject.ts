import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';

export async function generateUmlFromProject(
  projectRoot: string = process.env.NEXT_PUBLIC_PROJECT_PATH || ''
): Promise<string> {
  const parsed = await getAllFilesRecursive(projectRoot);
  const lines: string[] = ['classDiagram'];

  for (const file of parsed) {
    const { className, methods = [] } = file;

    lines.push(`  class ${className} {`);

    for (const method of methods) {
      lines.push(`    +${method.name}(): ${method.returnType || 'void'}`);
    }

    lines.push('  }');
  }

  // Simple class-to-class dependency via imports
  for (const file of parsed) {
    const { className, imports } = file;

    for (const imp of imports) {
      const importedClass = imp.split('.').pop();
      const exists = parsed.some(f => f.className === importedClass);
      if (importedClass && exists) {
        lines.push(`  ${className} --> ${importedClass}`);
      }
    }
  }

  if (parsed.length === 0) {
    lines.push('  %% No Java classes found');
  }

  return lines.join('\n');
}
