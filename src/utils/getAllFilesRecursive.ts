'use server';
import fs from 'fs';
import path from 'path';
import { parseJavaFile } from './java/parseJavaFile';
import { parseFile as parseTypeScriptFile } from './typescript/parseFile';
import { ELanguage } from '@/utils/detectLanguage';
import type { IFile } from '@/types/types';

/**
 * Recursively gets all .java or .ts/.tsx file paths and parses them.
 * Skips ignored directories like node_modules, .git, dist, etc.
 *
 * @param dir The directory to scan.
 * @param projectRoot The root directory to strip from paths.
 * @param language The target programming language.
 * @returns Array of parsed IFile metadata.
 */
export async function getAllFilesRecursive(
  dir: string = process.env.NEXT_PUBLIC_PROJECT_PATH || '',
  projectRoot: string = dir,
  language: ELanguage
): Promise<IFile[]> {
  const ignoredDirs = ['coverage', 'node_modules', '.git', 'dist', 'build', 'out', '.next'];
  let results: IFile[] = [];

  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (ignoredDirs.includes(file)) continue;

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(await getAllFilesRecursive(fullPath, projectRoot, language));
    } else {
      if (language === ELanguage.Java && file.endsWith('.java')) {
        results.push(await parseJavaFile(fullPath, projectRoot));
      } else if (
        language === ELanguage.TypeScript &&
        (file.endsWith('.ts') || file.endsWith('.tsx'))
      ) {
        results.push(await parseTypeScriptFile(fullPath, projectRoot));
      }
    }
  }

  return results;
}
