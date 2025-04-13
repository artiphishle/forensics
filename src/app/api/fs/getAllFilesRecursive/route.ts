'use server';
import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';
import { NextResponse } from 'next/server';

export async function GET() {
  const files = await getAllFilesRecursive();

  return NextResponse.json(files);
}
