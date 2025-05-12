import React from 'react';
import { useEffect, useState } from 'react';
import { Core } from 'cytoscape';

export default function ZoomInput({ cyInstance }: IZoomInput) {
  const [zoom, setZoom] = useState<number>(() => cyInstance?.zoom() ?? 1);
  const [zoomToFit, setZoomToFit] = useState<number>(() => cyInstance?.zoom() ?? 1);

  useEffect(() => {
    if (!cyInstance) return;
    cyInstance.on('zoom', () => setZoom(cyInstance.zoom()));
    setZoomToFit(cyInstance.zoom());
  }, [cyInstance]);

  useEffect(() => {
    if (zoomToFit === null) return;
    setZoom(zoomToFit);
  }, [zoomToFit]);

  useEffect(() => {
    if (!cyInstance || zoom === null) return;
    cyInstance.zoom(zoom);
  }, [zoom, cyInstance]);

  return (
    <div className="p-4 flex items-center justify-center gap-2 text-foreground bg-background dark:bg-gray-950 border-t border-t-gray-200 dark:border-t-gray-800">
      <label
        htmlFor="zoom"
        className="text-sm text-gray-600"
        onDoubleClick={() => {
          setZoom(zoomToFit);
        }}
      >
        Zoom
      </label>
      <input
        id="zoom"
        type="range"
        min="0.01"
        max="2"
        step="0.05"
        value={zoom}
        onChange={e => setZoom(parseFloat(e.target.value))}
        className="w-64"
      />
      <span className="text-sm text-gray-500">{(zoom * 100).toFixed(0)}%</span>
    </div>
  );
}

interface IZoomInput {
  readonly cyInstance: Core | null;
}
