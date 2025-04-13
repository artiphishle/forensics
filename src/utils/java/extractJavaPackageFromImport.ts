/**
 * Extracts the package name from an import string
 * @example import 'some.package.*'   => 'some.package'
 * @example import 'some.pakage.Name' => 'some.package'
 */
export function extractJavaPackageFromImport(imp: string) {
  // Remove trailing '.*' if present
  const cleaned = imp.replace(/\.\*$/, '');

  // Reverse '.' splitted segments to work more easily
  const segments = cleaned.split('.').reverse();

  // No package nesting means done
  if (segments.length < 2) return cleaned;

  // If last segment starts with lowerCase means done
  if (segments[0].toLowerCase() === segments[0]) return cleaned;

  // Strip class and return pure package name
  return segments.slice(1).reverse().join('.');
}
