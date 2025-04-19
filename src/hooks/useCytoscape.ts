'use client';
import { useEffect, useRef, useState } from 'react';
import cytoscape, {
  EventObject,
  Core,
  type ElementsDefinition,
  type NodeDataDefinition,
  type NodeDefinition,
  NodeSingular,
} from 'cytoscape';
import { useSettings } from '@/contexts/SettingsContext';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';
import { filterSubPackages } from '@/utils/filter/filterSubPackages';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';

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
    if (!cyRef.current || !filteredElements) return;

    function getMaxEdgeWeight() {
      return (
        filteredElements?.edges.reduce((max, edge) => {
          return edge.data.weight > max ? edge.data.weight : max;
        }, 0) ?? 0
      );
    }
    function getWeightBuckets(
      categoryCount: number,
      algorithm: 'linear' | 'log' | 'quantile' = 'linear'
    ) {
      if (!filteredElements) return { thresholds: [], counts: [] };

      const weights = filteredElements.edges.map(e => Number(e.data.weight));
      const max = getMaxEdgeWeight();

      const thresholds: number[] = [];
      const counts = new Array(categoryCount).fill(0);

      if (algorithm === 'linear') {
        for (let i = 1; i < categoryCount; i++) {
          thresholds.push((i * max) / categoryCount);
        }
        thresholds.push(max);
      } else if (algorithm === 'log') {
        const logMax = Math.log(max);
        for (let i = 1; i < categoryCount; i++) {
          thresholds.push(Math.exp((i * logMax) / categoryCount));
        }
        thresholds.push(max);
      } else if (algorithm === 'quantile') {
        const sorted = [...weights].sort((a, b) => a - b);
        for (let i = 1; i < categoryCount; i++) {
          const qIndex = Math.floor((i * sorted.length) / categoryCount);
          thresholds.push(sorted[qIndex]);
        }
        thresholds.push(max);
      }

      // Count how many weights fall into each bucket
      weights.forEach(w => {
        for (let i = 0; i < thresholds.length; i++) {
          if (w <= thresholds[i]) {
            counts[i]++;
            break;
          }
        }
      });

      return {
        thresholds: thresholds.map(Math.round),
        counts,
      };
    }
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const { counts, thresholds } = getWeightBuckets(3, 'linear');
    console.log('Weight: thresholds', thresholds, counts);

    const cy = cytoscape({
      container: cyRef.current,
      elements: filteredElements,
      selectionType: 'additive',
      userPanningEnabled: true,
      minZoom: 0.01,
      maxZoom: 2,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': isDark ? '#191919' : '#e9e9e9',
            'border-color': isDark ? '#191919' : '#e9e9e9',
            color: isDark ? '#e9e9e9' : '#191919',
            label: 'data(label)',
            shape: 'cut-rectangle',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 'label',
            height: 'label',
            padding: '24px',
            'border-width': 1,
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
            'border-color': '#d80303',
            'border-width': 3,
          },
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'line-color': isDark ? '#393939' : '#b9b9b9',
            color: isDark ? '#fff' : '#000',
            'text-margin-x': -20, // Label placement: Shift x
            'text-margin-y': -5, // Label placement: Shift y

            // Arrow
            'arrow-scale': 2,
            'target-arrow-color': isDark ? '#393939' : '#d8d8d8',
            'target-arrow-shape': 'triangle',
          },
        },
        { selector: 'edge[weight <= 1]', style: { label: '' } },
        {
          selector: `edge[weight > 1][weight <= ${thresholds[0]}]`,
          style: { width: 1, backgroundColor: isDark ? '#393939' : '#c8c8c8' },
        },
        {
          selector: `edge[weight > ${thresholds[0]}][weight <= ${thresholds[1]}]`,
          style: { width: 4, 'arrow-scale': 2, backgroundColor: isDark ? '#393939' : '#b8b8b8' },
        },
        { selector: `edge[weight > ${thresholds[1]}]`, style: { width: 8 } },
        {
          selector: 'edge.errorCycling',
          style: {
            'line-color': '#d80303',
            'target-arrow-color': '#d80303',
          },
        },
      ],
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

    cy.on('dblclick', 'node', (evt: EventObject) => {
      const node: NodeSingular = evt.target;

      function hasChildren(node: NodeSingular) {
        return elements!.nodes.some(elm => {
          return elm.data.id?.startsWith(`${node.data().id}.`);
        });
      }
      if (hasChildren(node)) {
        setCurrentPackage(node.id().replace(/\./g, '/'));
      }
    });

    return () => {
      cy.destroy();
      setCyInstance(null);
    };
  }, [elements, filteredElements, setCurrentPackage]);

  return { cyRef, cyInstance };
}
