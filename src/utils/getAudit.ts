'use server';
import { getParsedFileStructure } from '@/utils/getParsedFileStructure';
import { detectLanguage } from './detectLanguage';
import type { ILanguageDetectionResult } from './detectLanguage.types';
import type { IDirectory } from '@/types/types';

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

  const language = await detectLanguage(projectPath);

  // 1. Build audit object
  const audit: Partial<IAudit> = {
    meta: {
      language,
      projectName,
      timeStart,
      timeEnd: Infinity,
    },
    files: await getParsedFileStructure(),
  };

  audit.meta!.timeEnd = Date.now();

  return audit as IAudit;
}

interface IAuditMeta {
  timeEnd: number;
  readonly timeStart: number;
  readonly language: ILanguageDetectionResult;
  readonly projectName: string;
}

export interface IAudit {
  readonly meta: IAuditMeta;
  readonly files: IDirectory;
}
