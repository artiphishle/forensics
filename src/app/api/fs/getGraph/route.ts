'use server';
import { NextResponse } from 'next/server';
import { buildGraph } from '@/app/api/fs/utils/buildGraph';
import { getParsedFileStructure } from '@/app/api/fs/utils/getParsedFileStructure';
import { markCyclicPackagesWithEvidence } from '@/app/api/fs/utils/markCyclicPackages';

export async function GET() {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) {
    return NextResponse.json({ error: 'No path set' }, { status: 400 });
  }
  const files = await getParsedFileStructure();
  const graphWithCyclicDepsMarked = markCyclicPackagesWithEvidence(buildGraph(files), files);

  return NextResponse.json(graphWithCyclicDepsMarked);
}
