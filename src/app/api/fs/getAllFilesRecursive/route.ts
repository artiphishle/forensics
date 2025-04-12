'use server';
import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(getAllFilesRecursive());
}
