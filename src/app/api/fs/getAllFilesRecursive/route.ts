'use server';
import { getParsedFileStructure } from '@/utils/getParsedFileStructure';
import { NextResponse } from 'next/server';

export async function GET() {
  const files = await getParsedFileStructure();

  return NextResponse.json(files);
}
