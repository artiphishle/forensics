/**
 * Shared parser types for Java & TypeScript
 */

// Method Definition
export interface MethodDefinition {
  readonly name: string;
  readonly returnType: string;
  readonly parameters: string[];
  readonly visibility: 'public' | 'protected' | 'private' | 'default';
}

// Method Call
export interface MethodCall {
  readonly callee: string;
  readonly method: string;
}

// Import Definition
export interface ImportDefinition {
  readonly name: string;
  readonly pkg: string;
  readonly isIntrinsic?: boolean;
}

// File Metadata
export interface IFile {
  readonly className: string;
  readonly package: string;
  readonly imports: ImportDefinition[];
  readonly methods: MethodDefinition[];
  readonly calls: MethodCall[];
  readonly path: string;
}
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
