'use client';
import { useEffect, useRef, useState } from 'react';
import { layout as concentricLayout } from '@/themes/basic/layouts/concentric.layout';
import { layout as gridLayout } from '@/themes/basic/layouts/grid.layout';
import { layout as circleLayout } from '@/themes/basic/layouts/circle.layout';

import cytoscape, {
  Core,
  type ElementsDefinition,
  type NodeDataDefinition,
  type NodeDefinition,
} from 'cytoscape';
import { useSettings } from '@/contexts/SettingsContext';
import { getStyle } from '@/themes/basic/style';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';
import { filterSubPackages } from '@/utils/filter/filterSubPackages';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';
import { hasChildren } from '@/utils/cytoscape/hasChildren';
import { filterEmptyPackages } from '@/utils/filter/filterEmptyPackages';

const Layout = {
  circle: circleLayout,
  concentric: concentricLayout,
  grid: gridLayout,
};

export function useCytograph(
  elements: ElementsDefinition | null,
  currentPackage: string,
  setCurrentPackage: (path: string) => void
) {
  const cyRef = useRef<HTMLDivElement>(null);
  const [filteredElements, setFilteredElements] = useState<ElementsDefinition | null>(null);
  const [cyInstance, setCyInstance] = useState<Core | null>(null);
  const { showSubPackages, showVendorPackages } = useSettings();
  const [layout] = useState(process.env.NEXT_PUBLIC_SETTINGS_LAYOUT || 'grid');

  // Handle package filtering
  useEffect(() => {
    if (!elements) return;

    // 1. current package prefix
    const afterPkgFilter = filterByPackagePrefix(elements, currentPackage.replace(/\//g, '.'));
    // 2. show/hide sub packages
    const afterSubPkgFilter = showSubPackages ? afterPkgFilter : filterSubPackages(afterPkgFilter);
    // 3. show/hide vendor packages
    const afterVendorPkgFilter = showVendorPackages
      ? afterSubPkgFilter
      : filterVendorPackages(afterSubPkgFilter);
    // 4. Update currentPath if only one package inside
    const nonEmptyCurrentPackage = filterEmptyPackages(currentPackage, afterVendorPkgFilter);
    if (nonEmptyCurrentPackage !== currentPackage) {
      setCurrentPackage(nonEmptyCurrentPackage);
      return;
    }
    // 5. Shorten label by currentPackage
    const finalElements = {
      nodes: afterVendorPkgFilter.nodes.map(node => {
        const label = !currentPackage.length
          ? node.data.id!
          : node.data.id!.slice(currentPackage.length + 1);
        return {
          group: 'nodes',
          classes: node.classes || '',
          data: { ...node.data, label },
        } as NodeDefinition;
      }),
      edges: afterVendorPkgFilter.edges,
    };

    setFilteredElements(finalElements);
  }, [elements, currentPackage, setCurrentPackage, showSubPackages, showVendorPackages]);

  // Handle resize events
  useEffect(() => {
    if (!cyRef.current || !cyInstance) return;
    const handleResize = () => {
      cyInstance.fit();
    };
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(handleResize);
    });
    observer.observe(cyRef.current);
    return () => {
      observer.disconnect();
    };
  }, [cyRef, cyInstance]);

  // Setup Cytoscape, events, and interactions
  useEffect(() => {
    if (!cyRef.current || !elements || !filteredElements) return;

    filteredElements.nodes.forEach(n => {
      console.log(n.data.id?.split('.')[3]);
    });

    const cy = cytoscape({
      layout: Layout[layout as 'circle' | 'concentric' | 'grid'],
      style: getStyle(filteredElements),
      container: cyRef.current,
      elements: filteredElements,
      selectionType: 'additive',
      userPanningEnabled: true,
      minZoom: 0.01,
      maxZoom: 2,
    });

    setCyInstance(cy);

    /**
     * Central function to update highlights based on the current selection.
     * This handles nodes, edges, and summarization for multi-selection.
     */
    const updateHighlights = () => {
      const selectedNodes = cy.nodes(':selected');
      const allElements = cy.elements();

      // First, reset the state by removing all related classes from all elements.
      allElements.removeClass('hushed highlight highlight-outgoer highlight-incomer');

      // If nothing is selected, leave the graph in its default, fully visible state.
      if (selectedNodes.empty()) return;

      // The .neighborhood() method gets neighbor nodes AND the edges connecting to them.
      // We union this with the selected nodes to get the full set of elements to keep visible.
      const unhushedCollection = selectedNodes.union(selectedNodes.neighborhood());

      // "Hush" all elements (nodes and edges) that are NOT in our unhushed collection.
      allElements.difference(unhushedCollection).addClass('hushed');

      // --- Apply Specific Highlights ---

      // 1. Highlight the selected nodes themselves.
      selectedNodes.addClass('highlight');

      // 2. Highlight outgoing elements. .outgoers() returns both the outgoing EDGES and their target NODES
      selectedNodes.outgoers().addClass('highlight-outgoer');

      // 3. Highlight incoming elements. .incomers() returns both the incoming EDGES and their source NODES
      selectedNodes.incomers().addClass('highlight-incomer');
    };

    // Add listeners to run our highlight logic whenever the selection changes.
    cy.on('select', 'node', updateHighlights);
    cy.on('unselect', 'node', updateHighlights);

    cy.ready(() => {
      cy.nodes()
        .filter(node => !!(node.data as NodeDataDefinition).isParent)
        .addClass('is-parent');
    });

    // Interactions
    cy.on('mouseover', 'node', event => {
      const node = event.target;
      const rawNode = filteredElements.nodes.find(
        elm => elm.data.id === node.data().id
      ) as NodeDefinition;

      if (hasChildren(rawNode, elements.nodes)) document.body.style.cursor = 'pointer';

      // Temporarily highlight hovered node and its direct connections
      cy.elements()
        .subtract(node.outgoers())
        .subtract(node.incomers())
        .subtract(node)
        .addClass('hushed');
      node.addClass('highlight');
      node.outgoers().addClass('highlight-outgoer');
      node.incomers().addClass('highlight-incomer');
    });

    cy.on('mouseout', 'node', () => {
      document.body.style.cursor = 'default';
      // On mouseout, we restore the view to reflect the persistent selection state.
      updateHighlights();
    });

    let highlightDelay: ReturnType<typeof setTimeout>;
    cy.on('mouseover', 'edge', event => {
      const edge = event.target;
      edge.addClass('highlight-dependency');
      highlightDelay = setTimeout(() => {
        edge.source().addClass('highlight-dependency');
        edge.target().addClass('highlight-dependency');
      }, 150);
    });

    cy.on('mouseout', 'edge', event => {
      const edge = event.target;
      edge.removeClass('highlight-dependency');
      clearTimeout(highlightDelay);
      edge.source().removeClass('highlight-dependency');
      edge.target().removeClass('highlight-dependency');
    });

    cy.nodes().forEach(node => {
      const rawNode = filteredElements.nodes.find(
        elm => elm.data.id === node.data().id
      ) as NodeDefinition;

      if (!hasChildren(rawNode, elements.nodes)) return;

      node.addClass('isParent');
      node.addListener('dblclick', () => {
        setCurrentPackage(node.id().replace(/\./g, '/'));
      });
    });

    return () => {
      cy.destroy();
      setCyInstance(null);
    };
  }, [elements, filteredElements, setCurrentPackage]);

  return { cyRef, cyInstance };
}
