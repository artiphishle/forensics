'use server';
import { NextResponse } from 'next/server';
import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';
import type { IFile } from '@/types/types';

/**
 * Converts a list of parsed Java files into Cytoscape-compatible graph data.
 */
async function buildCytoscapeGraph(files: IFile[]) {
  const nodeSet = new Set<string>();
  const edgeSet = new Set<string>();

  for (const file of files) {
    const sourcePkg = file.package || '__root__';
    nodeSet.add(sourcePkg);

    for (const imp of file.imports) {
      const targetPkg = imp.split('.').slice(0, -1).join('.') || '__root__';
      nodeSet.add(targetPkg);
      edgeSet.add(`${sourcePkg}-->${targetPkg}`);
    }
  }

  const nodes = Array.from(nodeSet).map(pkg => ({
    data: { id: pkg, label: pkg.split('.').pop(), selectable: true },
  }));
  const edges = Array.from(edgeSet).map(link => {
    const [source, target] = link.split('-->');
    return { data: { source, target } };
  });

  return { nodes, edges };
}

export async function GET() {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) {
    return NextResponse.json({ error: 'No path set' }, { status: 400 });
  }

  const files = await getAllFilesRecursive(projectPath);
  const graph = await buildCytoscapeGraph(files);

  return NextResponse.json(graph);
}
