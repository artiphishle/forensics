import { describe, it } from 'node:test';
import { expect } from 'testosterone/src/matchers';
import { filterEmptyPackages } from '@/utils/filter/filterEmptyPackages';
import type { ElementsDefinition } from 'cytoscape';

describe('[filterEmptyPackage]', () => {
  it('skips empty intermediate packages and returns the first non-empty one', () => {
    const elements: ElementsDefinition = {
      nodes: [
        // Current package
        { data: { id: 'a' } },
        // Only one child
        { data: { id: 'a.b' } },
        // Multiple children of a.b
        { data: { id: 'a.b.c1' } },
        { data: { id: 'a.b.c2' } },
        // Unrelated node
        { data: { id: 'x.y.z' } },
      ],
      edges: [],
    };

    const currentPackage = 'a';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('a.b');
  });

  it('returns current package if it has multiple children', () => {
    const elements: ElementsDefinition = {
      nodes: [{ data: { id: 'a' } }, { data: { id: 'a.b1' } }, { data: { id: 'a.b2' } }],
      edges: [],
    };
    const currentPackage = 'a';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('a');
  });

  it('returns empty string if currentPath is empty and root has multiple children', () => {
    const elements: ElementsDefinition = {
      nodes: [{ data: { id: 'a' } }, { data: { id: 'b' } }],
      edges: [],
    };
    const currentPackage = '';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('');
  });

  it('returns currentPackage currentPath is empty and root has only one child', () => {
    const elements: ElementsDefinition = {
      nodes: [{ data: { id: 'a' } }, { data: { id: 'a.b1' } }, { data: { id: 'a.b2' } }],
      edges: [],
    };
    const currentPackage = '';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('a');
  });

  it('returns current package if it has no children', () => {
    const elements: ElementsDefinition = {
      nodes: [{ data: { id: 'a' } }, { data: { id: 'x.y.z' } }],
      edges: [],
    };

    const currentPackage = 'a';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('a');
  });
});
