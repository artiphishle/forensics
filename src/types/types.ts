export interface IFile {
  readonly className: string;
  readonly imports: string[];
  readonly package: string;
  readonly path: string; // relative path from project root
}

export interface ICytoscapeGraph {
  nodes: { data: { id: string } }[];
  edges: { data: { source: string; target: string } }[];
}
