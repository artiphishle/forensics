'use server';
import { NextResponse } from 'next/server';
import { getParsedFileStructure } from '@/app/api/fs/utils/getParsedFileStructure';

export async function GET() {
  const files = await getParsedFileStructure();

  return NextResponse.json(files);
}
