import type { EdgeDefinition, ElementsDefinition } from 'cytoscape';
import type { IDirectory } from '@/utils/getParsedFileStructure';
import type { IFile, IPkgEdgeData, IPkgNodeData, IRawElementsDefinition } from '@/types/types';

/**
 * Builds a weighted dependency graph based on package-level imports
 */
export function buildGraph(dir: IDirectory) {
  /**
   * Build graph (nodes/edges) recursively
   */
  function buildGraphRecursively(
    currentDir: IDirectory,
    currentPath = '',
    nodes: { data: IPkgNodeData }[] = [],
    edges: Map<string, EdgeDefinition> = new Map()
  ) {
    Object.keys(currentDir).forEach(key => {
      const dirOrFile: IDirectory | IFile = currentDir[key];
      const isDirectory = !dirOrFile?.className;

      // 1. Add directory as a node
      if (isDirectory) {
        const path = currentPath ? `${currentPath}.${key}` : key;
        nodes.push({ data: { id: path, path, label: path, isIntrinsic: true } });

        // Add subdirectories recursively
        return buildGraphRecursively(dirOrFile as IDirectory, path, nodes, edges);
      }
      // 2. Add file imports with cummulative weight as edges (package perspective)
      else {
        const target = (dirOrFile as IFile).package;
        const sources = (dirOrFile as IFile).imports.map(imp => imp.pkg);
        sources.forEach(source => {
          const edgeId = `${source}->${target}`;
          const isExistingEdge = !!edges.get(edgeId);
          const weight: IPkgEdgeData['weight'] = isExistingEdge
            ? edges.get(edgeId)?.data.weight + 1
            : 1;
          const data: IPkgEdgeData = { source, target, weight };

          // Set new or override existing edge
          edges.set(edgeId, { data });
        });
      }
    });

    return { nodes, edges };
  }

  const rawElements: IRawElementsDefinition = buildGraphRecursively(dir);

  // Add vendor packages (edge source|target which is not in 'nodes' already)
  rawElements.edges.forEach(({ data: { source, target } }) => {
    [source, target].forEach(maybeNode => {
      // Node already defined while handling 'src/main/java' dir (no vendor package)
      if (rawElements.nodes.find(node => node.data.id === maybeNode)) return;

      console.log('vendor node', maybeNode);

      // Add vendor node: 'isIntrinsic' is not set (vendor package)
      rawElements.nodes.push({ data: { id: maybeNode, label: maybeNode, path: maybeNode } });
    });
  });

  // Convert edges from Map (values) to EdgeDefinition[]
  const elements: ElementsDefinition = {
    nodes: rawElements.nodes,
    edges: Array.from(rawElements.edges.values()),
  };

  return elements;
}
