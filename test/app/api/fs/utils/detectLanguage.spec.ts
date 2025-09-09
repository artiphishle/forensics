import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { resolve } from 'node:path';
import { detectLanguage } from '@/app/api/fs/utils/detectLanguage';
import { ELanguage } from '@/app/api/fs/utils/detectLanguage.types';

describe('[detectLanguage]', () => {
  it('detects correct project language', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { confidence, indicators, language } = await detectLanguage(
      process.env.NEXT_PUBLIC_PROJECT_PATH
    );

    expect(indicators).toContain('pom.xml');
    expect(confidence).toBe(1);
    expect(language).toBe(ELanguage.Java);
  });
});
