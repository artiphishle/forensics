'use server';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ELanguage, detectLanguage } from '@/utils/detectLanguage';
import { parseJavaFile } from '@/utils/java/parseJavaFile';
import { parseFile as parseTypeScriptFile } from '@/utils/typescript/parseFile';
import type { IDirectory } from '@/types/types';

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
      return dir;
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
  const ignoredDirs = ['coverage', 'node_modules', '.git', 'dist', 'build', 'out', '.next'];
  const entries = readdirSync(dir, { withFileTypes: true }).filter(
    entry => !ignoredDirs.includes(entry.name)
  );

  for (const entry of entries) {
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
      else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')))
        result[entry.name] = await parseTypeScriptFile(fullPath, projectRoot);
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
  console.log('Language', detectLanguage(dir));
  const detectedLanguage = detectLanguage(dir).language;

  if (![ELanguage.Java, ELanguage.TypeScript].includes(detectedLanguage))
    throw new Error("Supported language is 'Java' & 'TypeScript'. More to follow.");

  // 2. Get validated root directory by detectedLanguage
  const rootDir = resolveRoot(dir, detectedLanguage);

  // 3. Read directory recursively
  const fileStructure = await readDirRecursively(rootDir, {}, '', detectedLanguage);

  return fileStructure;
}
