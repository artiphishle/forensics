/**
 * General
 */
export type TUniquePackageName = string;
export type TUuidV4 = string;

/**
 * File System
 */
export interface IFile {
  readonly className: string;
  readonly imports: string[];
  readonly methods: MethodDefinition[];
  readonly calls: MethodCall[];
  readonly package: string;
  readonly path: string; // relative path from project root
}

/**
 * Java Parser
 */

export interface JavaFileMetadata {
  readonly className: string;
  readonly package: string;
  readonly imports: string[];
  readonly path: string;
}
export interface MethodDefinition {
  readonly name: string;
  readonly returnType: string;
  readonly parameters: string[];
  readonly visibility: 'public' | 'protected' | 'private' | 'default';
}
export interface MethodCall {
  readonly callee: string;
  readonly method: string;
}
