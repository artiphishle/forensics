'use server';
import { NextResponse } from 'next/server';
import { buildGraph } from '@/utils/cytoscape/buildGraph';
import { getParsedFileStructure } from '@/utils/getParsedFileStructure';
import { getPackageCyclesWithMembers } from '@/utils/cytoscape/rules/markCyclicPackages';

export async function GET() {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) {
    return NextResponse.json({ error: 'No path set' }, { status: 400 });
  }
  const files = await getParsedFileStructure();
  const graphWithCyclicDepsMarked = getPackageCyclesWithMembers(files, buildGraph(files));

  return NextResponse.json(graphWithCyclicDepsMarked.graph);
}
