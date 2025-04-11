'use server';
import { NextResponse } from 'next/server';
import { buildWeightedPackageGraph } from '@/server/buildWeightedPackageGraph';
import { getAllFilesRecursive } from '@/server/getAllFilesRecursive';

export async function GET() {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) {
    return NextResponse.json({ error: 'No path set' }, { status: 400 });
  }
  const files = await getAllFilesRecursive(projectPath);
  const weightedGraph = await buildWeightedPackageGraph(files);

  return NextResponse.json(weightedGraph);
}
