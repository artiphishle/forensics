/**
 * Extracts the module path from a reversed import array
 * @example ['Button', 'components', 'ui', 'my-lib'] => 'my-lib/ui/components'
 */
export function extractTypeScriptPackageFromReversedImportArray(segments: string[]): string {
  const pkgSegments: string[] = [];

  for (const segment of segments) {
    // Stop collecting once we hit something starting with an uppercase letter (likely a class/file)
    if (/^[A-Z]/.test(segment)) break;
    pkgSegments.push(segment);
  }

  return pkgSegments.reverse().join('/');
}

/**
 * Extracts the package path from an import string.
 * @example 'lodash/debounce'     => 'lodash'
 * @example '@nestjs/common'      => '@nestjs/common'
 * @example './components/Button' => './components'
 */
export function extractTypeScriptPackageFromImport(imp: string): string {
  const cleaned = imp.replace(/\.(js|ts|jsx|tsx)$/, ''); // remove file extensions if any
  const segments = cleaned.split('/').reverse();

  // Handle single-package import (e.g., 'react', 'fs')
  if (segments.length < 2) return cleaned;

  // Remove file/class-like suffixes (e.g., 'Button.ts')
  return extractTypeScriptPackageFromReversedImportArray(segments);
}
