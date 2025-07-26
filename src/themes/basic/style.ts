import { getWeightBuckets } from '@/utils/cytoscape/getWeightBuckets';
import type { ElementsDefinition, StylesheetJson } from 'cytoscape';

export function getStyle(filteredElements: ElementsDefinition) {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log('[basic/style.ts] ColorMode:', isDark ? 'dark' : 'light');

  const dark = {
    bg: '#191919',
    edge: '#393939',
    weightXs: '#393939',
    weightMd: '#494949',
    weightXl: '#595959',
  };
  const light = {
    bg: '#e9e9e9',
    edge: '#b9b9b9',
    weightXs: '#c8c8c8',
    weightMd: '#b8b8b8',
    weightXl: '#a8a8a8',
  };
  const colors = isDark ? dark : light;
  const colorsInverted = isDark ? light : dark;
  const { thresholds } = getWeightBuckets(3, 'linear', filteredElements);

  const style: StylesheetJson = [
    // --- Default Node Style ---
    {
      selector: 'node',
      style: {
        'background-color': colors.bg,
        'border-color': colors.bg,
        color: colorsInverted.bg,
        label: 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        width: 'label',
        height: 'label',
        padding: '24px',
        'border-width': 1,
        'font-size': '16px',
      },
    },
    // --- Node State/Data Styles ---
    { selector: 'node.isParent', style: { 'font-weight': 'bold' } },
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
      selector: 'node.hushed',
      style: { 'background-opacity': 0.2, 'border-color': colors.bg, opacity: 0.5 },
    },
    { selector: 'edge.hushed', style: { opacity: 0 } },
    { selector: 'node.packageCycle', style: { 'border-color': '#d80303', 'border-width': 3 } },

    // --- Default Edge Style ---
    {
      selector: 'edge',
      style: {
        'arrow-scale': 2,
        'target-arrow-color': colors.edge,
        'target-arrow-shape': 'triangle',
        'line-color': colors.edge,
      },
    },
    // --- Edge Data Styles ---
    { selector: 'edge[weight <= 1]', style: { label: '' } },
    {
      selector: `edge[weight > 1][weight <= ${thresholds[0]}]`,
      style: { width: 1, backgroundColor: colors.weightXs },
    },
    {
      selector: `edge[weight > ${thresholds[0]}][weight <= ${thresholds[1]}]`,
      style: { width: 4, 'arrow-scale': 2, backgroundColor: colors.weightMd },
    },
    {
      selector: `edge[weight > ${thresholds[1]}]`,
      style: { backgroundColor: colors.weightXl, width: 8 },
    },
    {
      selector: 'edge.errorCycling',
      style: { 'line-color': '#d80303', 'target-arrow-color': '#d80303' },
    },
  ];

  return style;
}
