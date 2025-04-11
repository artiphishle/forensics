'use server';
import { getAllFilesRecursive } from '@/server/getAllFilesRecursive';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(getAllFilesRecursive());
}
