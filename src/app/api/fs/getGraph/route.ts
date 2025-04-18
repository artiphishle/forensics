'use server';
import { NextResponse } from 'next/server';
import { buildGraph } from '@/utils/cytoscape/buildGraph';
import { getParsedFileStructure } from '@/utils/getParsedFileStructure';

export async function GET() {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) {
    return NextResponse.json({ error: 'No path set' }, { status: 400 });
  }
  const files = await getParsedFileStructure();
  const graph = buildGraph(files);
  // const graphWithCyclingDepsMarked = markCyclicPackages(graph, files);

  return NextResponse.json(graph);
}
