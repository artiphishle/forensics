import { EdgeDefinition } from 'cytoscape';

export function getEdgesFromMap(cyPkgEdgesMap: Map<string, EdgeDefinition['data']>) {
  const cyPkgEdgesArray = Array.from(cyPkgEdgesMap.values());
  const edges: EdgeDefinition[] = cyPkgEdgesArray.map(edge => ({ data: { ...edge } }));

  return edges;
}
