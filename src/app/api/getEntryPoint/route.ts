import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';
import { findEntryPoint } from '@/utils/java/findEntryPoint';
import { NextResponse } from 'next/server';

/**
 * Returns the first entrypoint found in the project directory
 */
export async function GET() {
  // Read project path from .env
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath)
    return NextResponse.json({ error: 'Missing: NEXT_PUBLIC_PROJECT_PATH' }, { status: 400 });

  // Get all the files from the project
  const files = await getAllFilesRecursive(projectPath);

  // Find the first entry point of the project
  const entrypoint = findEntryPoint(files);
  if (!entrypoint) return NextResponse.json({}, { status: 400 });

  // Return the first entrypoint of the project
  return NextResponse.json(entrypoint.package);
}
