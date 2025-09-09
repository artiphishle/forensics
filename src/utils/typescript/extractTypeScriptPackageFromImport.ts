/**
 * Extracts the package path from an import string.
 * @example 'lodash/debounce'     => 'lodash'
 * @example '@nestjs/common'      => '@nestjs/common'
 * @example './components/Button' => './components'
 */
export function extractTypeScriptPackageFromImport(imp: string): string {
  console.log('import:', imp);
  const segments = imp.split('/'); // Split by '/'
  const pathSegments = segments.slice(0, -1).join('/'); // Remove file name
  const replacedAlias = pathSegments.startsWith('@/')
    ? pathSegments.replace(/^@/, 'src')
    : pathSegments;

  // Remove file/class-like suffixes (e.g., 'Button.tsx')
  return replacedAlias.split('/').join('.');
}
