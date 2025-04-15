'use server';
import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';
import { ILanguageDetectionResult, useLanguageDetection } from 'ankh-hooks';
import { NextResponse } from 'next/server';
import type { IFile } from '@/types/types';
import { getAudit } from '@/utils/getAudit';

/**
 * Audit (JSON)
 */
export async function GET() {
  const audit = await getAudit();
  const jsonString = JSON.stringify(audit, null, 2);
  const filename = `socomo-${audit.meta.timeEnd}-${audit.meta.projectName}-audit.json`;

  return new NextResponse(jsonString, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

interface IAuditMeta {
  timeEnd: number;
  timeStart: number;
  language: ILanguageDetectionResult;
  projectName: string;
}

interface IAudit {
  meta: IAuditMeta;
  files: IFile[];
}
