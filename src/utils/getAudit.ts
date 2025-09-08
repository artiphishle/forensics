'use server';
import { getParsedFileStructure } from '@/utils/getParsedFileStructure';
import { detectLanguage } from '@/utils/detectLanguage';
import type { ILanguageDetectionResult } from '@/utils/detectLanguage.types';
import type { IDirectory } from '@/types/types';
import { getCyclicPackages } from '@/utils/cytoscape/rules/markCyclicPackages';

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
  const files = await getParsedFileStructure();
  const cyclicPackages = getCyclicPackages(files);

  // 1. Build audit object
  const audit: Partial<IAudit> = {
    evaluation: {
      cyclicPackages: Array.from(cyclicPackages),
    },
    files,
    meta: {
      language,
      projectName,
      timeStart,
      timeEnd: Infinity,
    },
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
  readonly evaluation: {
    readonly cyclicPackages: string[];
  };
  readonly meta: IAuditMeta;
  readonly files: IDirectory;
}
