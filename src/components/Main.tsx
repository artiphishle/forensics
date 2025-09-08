import type { PropsWithChildren } from 'react';

import React from 'react';
import Settings from '@/components/Settings';

export default function Main({ children }: PropsWithChildren) {
  return (
    <main data-testid="main" className="p-4 flex flex-col md:flex-row flex-1 dark:bg-[#171717]">
      <Settings />
      {children}
    </main>
  );
}
