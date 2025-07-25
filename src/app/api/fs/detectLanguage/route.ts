'use server';
import { detectLanguage } from '@/utils/detectLanguage';
import { NextResponse } from 'next/server';

export async function GET() {
  const dir = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!dir) throw new Error("[api/fs/languageDetection] Missing ENV: 'NEXT_PUBLIC_PROJECT_PATH'");

  const language = detectLanguage(dir);

  return NextResponse.json({ language });
}
