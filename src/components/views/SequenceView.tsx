'use client';
import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';

type MermaidViewProps = {
  code: string;
};

export default function MermaidView({ code }: MermaidViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
    if (ref.current) {
      mermaid.render('mermaid-seq', code).then(({ svg }) => {
        ref.current!.innerHTML = svg;
      });
    }
  }, [code]);

  return <div ref={ref} className="mermaid w-full" />;
}
