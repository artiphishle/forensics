'use server';
import fs from 'fs';
import path from 'path';
import { getIntrinsicPackagesRecursive } from '@/utils/java/getIntrinsicPackagesRecursive';
import { extractJavaPackageFromImport } from './extractJavaPackageFromImport';
import type { IFile, IMethodCall, IMethodDefinition } from '@/types/types';

/**
 * Extracts the package declaration from Java code.
 */
function extractPackageName(content: string): string {
  const match = content.match(/^package\s+([a-zA-Z0-9_.]+);/m);
  return match?.[1] || '';
}

/**
 * Extracts import statements from Java code.
 */
function extractImports(content: string): string[] {
  return Array.from(content.matchAll(/^import\s+([a-zA-Z0-9_.*]+);/gm)).map(match => match[1]);
}

/**
 * Extracts the class name from the content and filename fallback.
 */
function extractClassName(content: string, fileName: string): string {
  const classPattern = new RegExp(`(?:public\\s+)?(class|interface|enum|record)\\s+${fileName}\\b`);
  const classNameMatch = content.match(classPattern);

  if (classNameMatch) return fileName;

  const fallback = content.match(/(?:public\s+)?(class|interface|enum|record)\s+([A-Za-z0-9_]+)/);
  return fallback?.[2] || '';
}

/**
 * Extracts the method definitions from file content
 */
function extractMethodDefinitions(content: string): IMethodDefinition[] {
  const methodRegex =
    /(?:(public|protected|private)\s+)?(?:static\s+)?([\w<>[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  const methods: IMethodDefinition[] = [];

  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const visibility = (match[1] as 'default' | 'public' | 'protected' | 'private') || 'default';
    const returnType = match[2];
    const name = match[3];
    const params = match[4]
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    methods.push({
      name,
      returnType,
      parameters: params,
      visibility,
    });
  }

  return methods;
}

/**
 * Extract method calls from file content
 */
function extractMethodCalls(content: string): IMethodCall[] {
  const callRegex = /(\b\w+)\.(\w+)\s*\(/g;
  const calls: IMethodCall[] = [];

  let match;
  while ((match = callRegex.exec(content)) !== null) {
    const callee = match[1];
    const method = match[2];
    calls.push({ callee, method });
  }

  return calls;
}

/**
 * Parses a Java file and returns metadata useful for diagram generation.
 */
export async function parseJavaFile(fullPath: string, projectRoot: string) {
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fileName = path.basename(fullPath, '.java');
  const intrinsicPackages = await getIntrinsicPackagesRecursive();

  const className = extractClassName(content, fileName);
  const pkg = extractPackageName(content);
  const imports = extractImports(content).map(imp => {
    const pkgFromImport = extractJavaPackageFromImport(imp);
    return {
      name: imp,
      pkg: pkgFromImport,
      isIntrinsic: intrinsicPackages.includes(pkgFromImport),
    };
  });
  const methods = extractMethodDefinitions(content);
  const calls = extractMethodCalls(content);
  const relativePath = path.relative(projectRoot, fullPath);

  const file: IFile = {
    className,
    package: pkg,
    imports,
    methods,
    calls,
    path: relativePath,
  };

  return file;
}
