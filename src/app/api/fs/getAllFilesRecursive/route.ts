'use server';
import { NextResponse } from 'next/server';
import { getParsedFileStructure } from '@/app/api/fs/utils/getParsedFileStructure';
import { markCyclicPackagesWithEvidence } from '../utils/markCyclicPackages';
import { buildGraph } from '../utils/buildGraph';

export async function GET() {
  const files = await getParsedFileStructure();
  const graph = markCyclicPackagesWithEvidence(buildGraph(files), files);

  return NextResponse.json(graph);
}
