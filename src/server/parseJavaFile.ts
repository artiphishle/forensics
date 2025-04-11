'use server';
import fs from 'fs';
import path from 'path';

/**
 * Reads a Java file and extracts the class name, package, and imports.
 * @param fullPath The full absolute file path.
 * @param projectRoot The root project path to make paths relative.
 */
export async function parseJavaFile(fullPath: string, projectRoot: string) {
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fileName = path.basename(fullPath, '.java');

  const classPattern = new RegExp(`(?:public\\s+)?(class|interface|enum|record)\\s+${fileName}\\b`);
  const classNameMatch = content.match(classPattern);

  // Fallback: take the first top-level class/enum/interface if names don't match
  const fallbackClassMatch = content.match(
    /(?:public\s+)?(class|interface|enum|record)\s+([A-Za-z0-9_]+)/
  );

  const packageMatch = content.match(/^package\s+([a-zA-Z0-9_.]+);/m);
  const imports = Array.from(content.matchAll(/^import\s+([a-zA-Z0-9_.*]+);/gm)).map(
    match => match[1]
  );

  const relativePath = path.relative(projectRoot, fullPath);

  return {
    className: classNameMatch ? fileName : fallbackClassMatch?.[2] || '',
    package: packageMatch?.[1] || '',
    imports,
    path: relativePath,
  };
}
