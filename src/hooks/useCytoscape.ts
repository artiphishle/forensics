'use client';
import { useEffect, useRef, useState } from 'react';
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

export function useCytograph(
  elements: ElementsDefinition | null,
  currentPackage: string,
  setCurrentPackage: (path: string) => void
) {
  const cyRef = useRef<HTMLDivElement>(null);
  const [filteredElements, setFilteredElements] = useState<ElementsDefinition | null>(null);
  const [cyInstance, setCyInstance] = useState<Core | null>(null);
  const { showSubPackages, showVendorPackages } = useSettings();

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

    // 4. Shorten label by currentPackage
    const finalElements = {
      nodes: afterVendorPkgFilter.nodes.map(node => {
        const label = !currentPackage.length
          ? node.data.id!
          : node.data.id!.slice(currentPackage.length + 1);
        return { classes: node.classes || '', data: { ...node.data, label } } as NodeDefinition;
      }),
      edges: afterVendorPkgFilter.edges,
    };

    setFilteredElements(finalElements);
  }, [elements, currentPackage, showSubPackages, showVendorPackages]);

  useEffect(() => {
    if (!cyRef.current || !cyInstance) return;

    const handleResize = () => {
      cyInstance.fit();
    };

    const observer = new ResizeObserver(() => {
      // Simple debounce using requestAnimationFrame
      requestAnimationFrame(handleResize);
    });

    observer.observe(cyRef.current);

    return () => {
      observer.disconnect();
    };
  }, [cyRef, cyInstance]);

  // Setup Cytoscape when filteredElements change
  useEffect(() => {
    if (!cyRef.current || !elements || !filteredElements) return;

    const cy = cytoscape({
      style: getStyle(filteredElements),
      container: cyRef.current,
      elements: filteredElements,
      selectionType: 'additive',
      userPanningEnabled: true,
      minZoom: 0.01,
      maxZoom: 2,
      layout: {
        avoidOverlap: true,
        name: 'concentric',
        fit: true,
      },
    });

    setCyInstance(cy);

    cy.ready(() => {
      cy.nodes()
        .filter(node => !!(node.data as NodeDataDefinition).isParent)
        .addClass('is-parent');
    });

    // Interactions
    cy.on('mouseover', 'node', event => {
      const node = event.target;
      cy.elements()
        .subtract(node.outgoers())
        .subtract(node.incomers())
        .subtract(node)
        .addClass('hushed');
      node.addClass('highlight');
      node.outgoers().addClass('highlight-outgoer');
      node.incomers().addClass('highlight-ingoer');
    });

    cy.on('mouseout', 'node', event => {
      const node = event.target;
      cy.elements().removeClass('hushed');
      node.removeClass('highlight');
      node.outgoers().removeClass('highlight-outgoer');
      node.incomers().removeClass('highlight-ingoer');
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
