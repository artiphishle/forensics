'use server';
import fs from 'fs';
import path from 'path';
import { parseJavaFile } from './parseJavaFile';
import type { IFile } from '@/types/types';

/**
 * Recursively gets all .java file paths and parses them.
 * @param dir The directory to scan.
 * @param projectRoot The root directory to strip from paths.
 */
export async function getAllFilesRecursive(
  dir: string = process.env.NEXT_PUBLIC_PROJECT_PATH || '',
  projectRoot: string = dir
) {
  let results: IFile[] = [];

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(await getAllFilesRecursive(fullPath, projectRoot));
    } else if (file.endsWith('.java')) {
      results.push(await parseJavaFile(fullPath, projectRoot));
    }
  }

  return results;
}
