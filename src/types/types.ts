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
  readonly methods: IMethodDefinition[];
  readonly calls: IMethodCall[];
  readonly package: string;
  readonly path: string; // relative path from project root
}

/**
 * Java Parser
 */
export interface IMethodDefinition {
  readonly name: string;
  readonly returnType: string;
  readonly parameters: string[];
  readonly visibility: 'public' | 'protected' | 'private' | 'default';
}
export interface IMethodCall {
  readonly callee: string;
  readonly method: string;
}
