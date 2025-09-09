'use server';
import { ELanguage } from '@/app/api/fs/utils/detectLanguage.types';
import type { IDirectory } from '@/app/api/fs/utils/types';

import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { detectLanguage } from '@/app/api/fs/utils/detectLanguage';
import { parseJavaFile } from '@/app/api/fs/utils/parser/java/parseJavaFile';
import { parseFile as parseTypeScriptFile } from '@/app/api/fs/utils/parser/typescript/parseFile';

/**
 * Returns whether Java file structure is valid
 */
function isValidJavaFileStructure(dir: string) {
  const srcMainJavaDir = resolve(dir, 'src/main/java');
  if (!existsSync(srcMainJavaDir)) throw new Error("Missing dir: 'src/main/java'");

  return true;
}

/**
 * Returns resolved root
 */
function resolveRoot(dir: string, detectedLanguage: ELanguage) {
  switch (detectedLanguage) {
    case ELanguage.Java:
      isValidJavaFileStructure(dir);
      return resolve(dir, 'src/main/java');
    case ELanguage.TypeScript:
      return resolve(dir);
    default:
      throw new Error(`Invalid file structure for ${detectedLanguage}`);
  }
}

/**
 * Read directory recursively
 */
export async function readDirRecursively(
  dir: string,
  result: IDirectory = {},
  projectRoot = dir,
  language: ELanguage
) {
  // 1. Read current directory
  const entries = readdirSync(dir, { withFileTypes: true });
  const ignores = [
    '.cache',
    'coverage',
    '.git',
    '.github',
    'examples',
    'packages',
    'test',
    '.meta',
    'node_modules',
    '.next',
    '.vscode',
  ];

  for (const entry of entries) {
    if (ignores.includes(entry.name)) continue;

    const fullPath = join(dir, entry.name);

    if (language === ELanguage.Java) {
      // 2.1 Add directory recursively
      if (entry.isDirectory())
        result[entry.name] = await readDirRecursively(fullPath, {}, '', language);
      // 2.2 Add parsed .java file
      else if (entry.isFile() && entry.name.endsWith('.java'))
        result[entry.name] = await parseJavaFile(fullPath, projectRoot);
    } else if (language === ELanguage.TypeScript) {
      // 2.1 Add directory recursively
      if (entry.isDirectory())
        result[entry.name] = await readDirRecursively(fullPath, {}, '', language);
      // 2.2 Add parsed .ts{x} file
      else if ((entry.isFile() && entry.name.endsWith('.ts')) || entry.name.endsWith('.tsx')) {
        result[entry.name] = await parseTypeScriptFile(fullPath, projectRoot);
      }
    }
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
  const detectedLanguage = (await detectLanguage(dir)).language;

  console.log('detected:', detectedLanguage);

  if (![ELanguage.Java, ELanguage.TypeScript].includes(detectedLanguage))
    throw new Error("Supported language is 'Java' & 'TypeScript'. More to follow.");

  // 2. Get validated root directory by detectedLanguage
  const rootDir = resolveRoot(dir, detectedLanguage);
  console.log('rootDir:', rootDir);

  // 3. Read directory recursively
  const fileStructure = await readDirRecursively(rootDir, {}, '', detectedLanguage);

  return fileStructure;
}
