'use server';
import { useLanguageDetection, type ILanguageDetectionResult } from 'ankh-hooks';
import { getAllFilesRecursive } from '@/utils/getAllFilesRecursive';
import type { IFile } from '@/types/types';

/**
 * Returns audit for JSON or XML exports
 */
export async function getAudit() {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH || '';
  const projectName = projectPath.split('/').pop();
  if (!projectName) {
    throw new Error('Invalid .env: NEXT_PUBLIC_PROJECT_PATH');
  }

  const timeStart = Date.now();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const language = useLanguageDetection(projectPath);

  // 1. Build audit object
  const audit: Partial<IAudit> = {
    meta: {
      language,
      projectName,
      timeStart,
      timeEnd: Infinity,
    },
    files: await getAllFilesRecursive(projectPath),
  };

  audit.meta!.timeEnd = Date.now();

  return audit as IAudit;
}

interface IAuditMeta {
  timeEnd: number;
  timeStart: number;
  language: ILanguageDetectionResult;
  projectName: string;
}

export interface IAudit {
  meta: IAuditMeta;
  files: IFile[];
}
