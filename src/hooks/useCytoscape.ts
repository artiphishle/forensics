'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape, { ElementsDefinition, NodeSingular, EventObject, Core } from 'cytoscape';
import { useSettings } from '@/contexts/SettingsContext';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';
import { filterSubPackages } from '@/utils/filter/filterSubPackages';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';

export function useCytograph(
  elements: ElementsDefinition,
  currentPackage: string,
  setCurrentPackage: (path: string) => void
) {
  const cyRef = useRef<HTMLDivElement>(null);
  const [filteredElements, setFilteredElements] = useState<ElementsDefinition | null>(null);
  const [cyInstance, setCyInstance] = useState<Core | null>(null);
  const { showSubPackages, showVendorPackages } = useSettings();

  function hasChildren(node: NodeSingular) {
    return elements.nodes.some(elm => {
      return elm.data.id?.startsWith(`${node.data().id}.`);
    });
  }

  // Handle package filtering
  useEffect(() => {
    // 1. current package prefix
    const afterPkgFilter = filterByPackagePrefix(elements, currentPackage.replace(/\//g, '.'));
    // 2. show/hide sub packages
    const afterSubPkgFilter = showSubPackages ? afterPkgFilter : filterSubPackages(afterPkgFilter);
    // 3. show/hide vendor packages
    const afterVendorPkgFilter = showVendorPackages
      ? afterSubPkgFilter
      : filterVendorPackages(afterSubPkgFilter);

    setFilteredElements(afterVendorPkgFilter);
  }, [currentPackage, showSubPackages, showVendorPackages]);

  // Setup Cytoscape when filteredElements change
  useEffect(() => {
    if (!cyRef.current || !filteredElements) return;

    const cy = cytoscape({
      container: cyRef.current,
      elements: filteredElements,
      selectionType: 'additive',
      userPanningEnabled: true,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#e9e9e9',
            label: 'data(id)',
            shape: 'cut-rectangle',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 'label',
            height: 'label',
            padding: '24px',
            'border-width': 2,
            'border-color': '#9a9a9a',
            'font-size': '16px',
          },
        },
        {
          selector: 'node:parent',
          style: {
            'background-opacity': 0,
            'border-opacity': 0,
            padding: '0',
          },
        },
        {
          selector: 'node.is-parent',
          style: { 'background-color': 'green' },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#024a71',
            'border-color': '#024a71',
            color: '#fff',
            'border-width': 2,
          },
        },
        {
          selector: '.hushed',
          style: { opacity: 0.3 },
        },
        {
          selector: 'node.packageCycle',
          style: {
            'border-color': '#ff4500',
            'border-width': 3,
            'background-color': '#ffe4e1',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#a9a9a9',
            'target-arrow-color': '#a8a8a8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        {
          selector: 'edge.errorCycling',
          style: {
            'line-color': '#FC0000',
            'target-arrow-color': '#FC0000',
          },
        },
      ],
      layout: {
        avoidOverlap: true,
        name: 'concentric',
        fit: true,
      },
    });

    setCyInstance(cy); // ✅ expose the instance for zooming, etc.

    cy.ready(() => {
      cy.nodes()
        .filter(node => !!(node.data as any).isParent)
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

    let highlightDelay: any;
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

    cy.on('dblclick', 'node', (evt: EventObject) => {
      const node: NodeSingular = evt.target;
      if (hasChildren(node)) {
        setCurrentPackage(node.id().replace(/\./g, '/'));
      }
    });

    return () => {
      cy.destroy();
      setCyInstance(null);
    };
  }, [filteredElements]);

  return { cyRef, cyInstance };
}
