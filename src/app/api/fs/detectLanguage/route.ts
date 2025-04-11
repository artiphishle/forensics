'use server';
import { useLanguageDetection } from 'ankh-hooks';
import { NextResponse } from 'next/server';

export async function GET() {
  const dir = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!dir) throw new Error("[api/fs/languageDetection] Missing ENV: 'NEXT_PUBLIC_PROJECT_PATH'");

  const language = useLanguageDetection(dir);

  return NextResponse.json({ language });
}
