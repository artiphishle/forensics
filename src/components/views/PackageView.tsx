'use client';
import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { ElementsDefinition, EventObject, NodeSingular } from 'cytoscape';

export default function Cytograph({ elements, currentPackage, setCurrentPackage }: ICytograph) {
  const cyRef = useRef<HTMLDivElement>(null);
  const [filteredElements, setFilteredElements] = useState<ElementsDefinition | null>(null);

  function filterElementsByPackage(
    allElements: cytoscape.ElementsDefinition,
    packagePrefix: string
  ): cytoscape.ElementsDefinition {
    // PackageView entrypoint, no prefix
    if (!packagePrefix) return allElements;

    // Active filtering (subpackage view)
    const pkgPrefix = packagePrefix.endsWith('.') ? packagePrefix : packagePrefix + '.';
    const allowedNodes = allElements.nodes.filter(node => {
      return (node.data.id as string).startsWith(pkgPrefix);
    });

    const allowedNodeIds = new Set(allowedNodes.map(node => node.data.id));
    const allowedEdges = allElements.edges.filter(
      edge => allowedNodeIds.has(edge.data.source) && allowedNodeIds.has(edge.data.target)
    );

    return {
      nodes: allowedNodes,
      edges: allowedEdges,
    };
  }

  function hasChildren(node: NodeSingular) {
    return elements.nodes.some(elm => {
      return elm.data.id?.startsWith(`${node.data().id}.`);
    });
  }

  // 1. Apply node filter when path changes
  useEffect(() => {
    setFilteredElements(filterElementsByPackage(elements, currentPackage.replace(/\//g, '.')));
  }, [currentPackage]);

  // 2. Show nodes after node filter has been applied
  useEffect(() => {
    if (!cyRef.current || !filteredElements) return;
    console.log('[Packages] currentPackage', currentPackage || '[root]');

    const cy = cytoscape({
      container: cyRef.current,
      elements: filteredElements,
      selectionType: 'additive',
      userPanningEnabled: true,
      style: [
        // Nodes
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
          },
        },
        {
          selector: 'node:parent',
          style: {
            'background-opacity': 0,
            'border-opacity': 0,
            label: '', // hide label if needed
            padding: '0',
            shape: 'rectangle', // optional, but more neutral
            width: 1,
            height: 1,
          },
        },
        {
          selector: 'node.is-parent',
          style: { 'background-color': 'green' },
        },
        // Selected nodes
        {
          selector: 'node:selected',
          style: {
            'background-color': '#44ffee',
            'border-color': '#00bbaa',
            'border-width': 2,
          },
        },
        {
          selector: '.hushed',
          style: {
            opacity: 0.3,
          },
        },
        {
          selector: 'node.packageCycle',
          style: {
            'border-color': '#ff4500',
            'border-width': 3,
            'background-color': '#ffe4e1',
          },
        },

        // Edges
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
        // Edges Error: Cycling Dependencies
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

    cy.ready(() => {
      console.log('[Packages] Cytoscape "ready"');
      cy.nodes()
        .filter(node => !!(node.data as any).isParent)
        .addClass('is-parent');
    });
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
    // highlighting on edge hover (highlight single dependency with its source component and target component)
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
    cy.on('tap', 'node', event => {
      const node = event.target;
    });
    cy.on('dblclick', 'node', (evt: EventObject) => {
      const node: NodeSingular = evt.target;
      node.data().id.startsWith();
      if (hasChildren(node)) setCurrentPackage(node.id().replace(/\./g, '/'));
    });
    return () => {
      cy.destroy();
    };
  }, [filteredElements]);

  return <div ref={cyRef} style={{ flex: 1 }} />;
}

interface ICytograph {
  readonly currentPackage: string;
  readonly setCurrentPackage: (path: string) => void;
  readonly elements: ElementsDefinition;
}
