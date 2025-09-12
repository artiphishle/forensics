'use server';
import { NextResponse } from 'next/server';
import { relative } from 'node:path';
import { detectLanguage } from '@/app/api/fs/utils/detectLanguage';
import { resolveRoot } from '@/app/api/fs/utils/getParsedFileStructure';

export async function GET() {
  const projectRoot = process.env.NEXT_PUBLIC_PROJECT_PATH || '';
  const { language } = await detectLanguage(projectRoot);
  const relativeRootDir = relative(projectRoot, await resolveRoot(projectRoot, language));

  return NextResponse.json(relativeRootDir);
}
