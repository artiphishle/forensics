import type { EdgeDataDefinition, EdgeDefinition, NodeDataDefinition } from 'cytoscape';

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
  readonly imports: IJavaImport[];
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

export interface IJavaImport {
  readonly name: string;
  readonly pkg: string;
  readonly isIntrinsic?: boolean;
}

/**
 * Cytoscape
 */
export interface IPkgNodeData extends NodeDataDefinition {
  readonly path: string;
  readonly isIntrinsic?: boolean;
}
export interface IPkgEdgeData extends EdgeDataDefinition {
  weight: number;
}
export interface IRawElementsDefinition {
  readonly nodes: { data: IPkgNodeData }[];
  readonly edges: Map<string, EdgeDefinition>;
}
