'use server';
import type { ILanguageDetectionResult } from '@/app/api/fs/utils/detectLanguage.types';
import type { IDirectory } from '@/app/api/fs/utils/types';

import { getParsedFileStructure } from '@/app/api/fs/utils/getParsedFileStructure';
import { detectLanguage } from '@/app/api/fs/utils/detectLanguage';
import {
  getPackageCyclesWithMembers,
  PackageCycleDetail,
} from '@/app/api/fs/utils/markCyclicPackages';
import { buildGraph } from '@/app/api/fs/utils/buildGraph';

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
  const graph = buildGraph(files);
  const cyclicPackages = getPackageCyclesWithMembers(files, graph).cycles;

  // 1. Build audit object
  const audit: Partial<Audit> = {
    evaluation: {
      cyclicPackages,
    },
    files,
    meta: {
      language,
      projectName,
      timeStart,
      timeEnd: timeStart,
    },
  };

  audit.meta!.timeEnd = Date.now();

  return audit as Audit;
}

interface AuditMeta {
  timeEnd: number;
  readonly timeStart: number;
  readonly language: ILanguageDetectionResult;
  readonly projectName: string;
}

export interface Audit {
  readonly evaluation: {
    readonly cyclicPackages: PackageCycleDetail[];
  };
  readonly meta: AuditMeta;
  readonly files: IDirectory;
}
