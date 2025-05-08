import type { ElementsDefinition, StylesheetJson } from 'cytoscape';
import { getWeightBuckets } from '@/utils/cytoscape/getWeightBuckets';
import { Style } from 'cytoscape';

export function getStyle(filteredElements: ElementsDefinition) {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const { thresholds } = getWeightBuckets(3, 'linear', filteredElements);

  const style: StylesheetJson = [
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
      selector: 'node.drill-into',
      style: { 'font-weight': 'bold' },
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
  ];

  return style;
}
