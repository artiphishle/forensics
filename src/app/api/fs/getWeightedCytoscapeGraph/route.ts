'use server';
import { NextResponse } from 'next/server';
import { buildWeightedPackageGraph } from '@/utils/cytoscape/buildWeightedPackageGraph';
import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';
import { markCyclicPackages } from '@/utils/cytoscape/rules/markCyclicPackages';

export async function GET() {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) {
    return NextResponse.json({ error: 'No path set' }, { status: 400 });
  }
  const files = await getAllFilesRecursive(projectPath);
  const graph = buildWeightedPackageGraph(files);
  const graphWithCyclingDepsMarked = markCyclicPackages(graph, files);

  return NextResponse.json(graphWithCyclingDepsMarked);
}
