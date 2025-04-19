'use server';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ELanguage, useLanguageDetection } from 'ankh-hooks';
import { parseJavaFile } from '@/utils/java/parseJavaFile';
import type { IDirectory } from '@/types/types';

/**
 * Read directory recursively
 */
export async function readDirRecursively(dir: string, result: IDirectory = {}, projectRoot = dir) {
  // 1. Read current directory
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    // 2.1 Add directory recursively
    if (entry.isDirectory()) result[entry.name] = await readDirRecursively(fullPath);
    // 2.2 Add parsed .java file
    else if (entry.isFile() && entry.name.endsWith('.java'))
      result[entry.name] = await parseJavaFile(fullPath, projectRoot);
  }

  return result;
}

/**
 * Entrypoint
 */
export async function getParsedFileStructure(
  dir: string = process.env.NEXT_PUBLIC_PROJECT_PATH || ''
) {
  // 1. Detect language & filter non-supported
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (useLanguageDetection(dir).language !== ELanguage.Java)
    throw new Error("Supported language is 'Java'. More to follow.");

  // 2. Ensure 'src/main/java' directory
  const srcMainJavaDir = resolve(dir, 'src/main/java');
  if (!existsSync(srcMainJavaDir)) throw new Error("Missing dir: 'src/main/java'");

  // 3. Read directory recursively
  const fileStructure = await readDirRecursively(srcMainJavaDir);

  return fileStructure;
}
