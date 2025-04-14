import { useEffect, useState } from 'react';
import { Core } from 'cytoscape';

export default function ZoomInput({ cyInstance }: IZoomInput) {
  const [zoom, setZoom] = useState<number | null>(null);
  const [zoomToFit, setZoomToFit] = useState<number | null>(null);

  useEffect(() => {
    if (!cyInstance || zoom !== null) return;
    setZoomToFit(cyInstance.zoom());
  }, [cyInstance]);

  useEffect(() => {
    if (zoomToFit === null) return;
    setZoom(zoomToFit);
  }, [zoomToFit]);

  useEffect(() => {
    if (!cyInstance || zoom === null) return;
    cyInstance.zoom(zoom);
    cyInstance.center();
  }, [zoom]);

  if (zoom === null) return;

  return (
    <div className="p-4 flex items-center gap-2 text-black bg-amber-200">
      <label
        htmlFor="zoom"
        className="text-sm text-gray-600"
        onDoubleClick={e => {
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
