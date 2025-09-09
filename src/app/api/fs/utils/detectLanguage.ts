'use server';
import fs from 'node:fs';
import path from 'node:path';
import { ELanguage, ILanguageDetectionResult } from '@/app/api/fs/utils/detectLanguage.types';

export async function detectLanguage(directoryPath: string): Promise<ILanguageDetectionResult> {
  // Check if directory exists
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    throw new Error(`Directory does not exist: ${directoryPath}`);
  }

  const files = fs.readdirSync(directoryPath);
  const indicators: Record<ELanguage, string[]> = {
    [ELanguage.JavaScript]: [],
    [ELanguage.TypeScript]: [],
    [ELanguage.Java]: [],
    [ELanguage.Unknown]: [],
  };

  // Check for JavaScript indicators
  if (files.includes('package.json') && !files.includes('tsconfig.json')) {
    indicators[ELanguage.JavaScript].push('package.json without tsconfig.json');
  }
  if (files.some(file => file.endsWith('.js') || file.endsWith('.jsx'))) {
    indicators[ELanguage.JavaScript].push('.js/.jsx files');
  }
  if (files.includes('node_modules')) {
    indicators[ELanguage.JavaScript].push('node_modules directory');
  }

  // Check for TypeScript indicators
  if (files.includes('tsconfig.json')) {
    indicators[ELanguage.TypeScript].push('tsconfig.json');
  }
  if (files.some(file => file.endsWith('.ts') || file.endsWith('.tsx'))) {
    indicators[ELanguage.TypeScript].push('.ts/.tsx files');
  }
  if (files.includes('package.json')) {
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(directoryPath, 'package.json'), 'utf8')
      );
      if (packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript) {
        indicators[ELanguage.TypeScript].push('typescript dependency');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Check for Java indicators
  if (files.includes('pom.xml')) {
    indicators[ELanguage.Java].push('pom.xml');
  }
  if (files.includes('build.gradle') || files.includes('build.gradle.kts')) {
    indicators[ELanguage.Java].push('gradle build file');
  }
  if (files.some(file => file.endsWith('.java'))) {
    indicators[ELanguage.Java].push('.java files');
  }
  if (files.includes('.mvn') || files.includes('mvnw') || files.includes('mvnw.cmd')) {
    indicators[ELanguage.Java].push('Maven wrapper');
  }

  // Determine the most likely language
  const counts = {
    [ELanguage.JavaScript]: indicators[ELanguage.JavaScript].length,
    [ELanguage.TypeScript]: indicators[ELanguage.TypeScript].length,
    [ELanguage.Java]: indicators[ELanguage.Java].length,
    [ELanguage.Unknown]: 0,
  };

  let detectedLanguage = ELanguage.Unknown;
  let maxCount = 0;

  for (const [language, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      detectedLanguage = language as ELanguage;
    }
  }

  // Calculate confidence (0-1)
  const totalIndicators = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const confidence = totalIndicators > 0 ? maxCount / totalIndicators : 0;

  return {
    language: detectedLanguage,
    confidence,
    indicators: indicators[detectedLanguage],
  };
}

export async function isJavaScriptRoot(directoryPath: string): Promise<boolean> {
  const files = fs.readdirSync(directoryPath);
  return files.includes('package.json') && !files.includes('tsconfig.json');
}

export async function isTypeScriptRoot(directoryPath: string): Promise<boolean> {
  const files = fs.readdirSync(directoryPath);
  return files.includes('tsconfig.json') && files.includes('package.json');
}

export async function isJavaRoot(directoryPath: string): Promise<boolean> {
  const files = fs.readdirSync(directoryPath);
  return (
    files.includes('pom.xml') ||
    files.some(file => file.endsWith('.java')) ||
    files.includes('build.gradle') ||
    files.includes('build.gradle.kts')
  );
}
