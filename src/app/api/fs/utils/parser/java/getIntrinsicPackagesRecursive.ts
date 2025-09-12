'use server';
import { readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

export async function getIntrinsicPackagesRecursive(
  root: string = resolve(process.env.NEXT_PUBLIC_PROJECT_PATH || ''),
  currentPath?: string,
  results: string[] = []
) {
  if (!root) throw new Error('Required env: NEXT_PUBLIC_PROJECT_PATH');

  const basePath = resolve(root, 'src/main/java');
  const dirPath = currentPath ?? basePath;

  const entries = readdirSync(dirPath, { withFileTypes: true });

  const subdirs = entries.filter(e => e.isDirectory());
  const javaFiles = entries.filter(e => e.isFile() && e.name.endsWith('.java'));

  // Only include if it has .java files and no subdirectories
  if (javaFiles.length > 0 && subdirs.length === 0) {
    const relPath = relative(basePath, dirPath).replace(/\//g, '.');
    results.push(relPath);
  }

  // Recurse into subdirectories
  for (const dir of subdirs) {
    const fullPath = resolve(dirPath, dir.name);
    await getIntrinsicPackagesRecursive(root, fullPath, results);
  }

  return results;
}
