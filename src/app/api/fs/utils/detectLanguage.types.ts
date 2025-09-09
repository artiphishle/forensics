export enum ELanguage {
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  Java = 'java',
  Unknown = 'unknown',
}

export interface ILanguageDetectionResult {
  language: ELanguage;
  confidence: number;
  indicators: string[];
}
