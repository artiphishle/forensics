import React from 'react';
import Popover from '@/components/Popover';
import type { PropsWithChildren } from 'react';

export default function Header({ children, title }: IHeader) {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH || '{Unknown}';
  const projectName = projectPath.split('/').pop();

  return (
    <header className="flex flex-row items-center justify-between bg-sky-100 dark:bg-black border border-gray-100 dark:border-gray-800 p-2 gap-4">
      <div className="flex flex-row items-center justify-start">
        <Popover />
        <h1 className="ml-4 text-foreground">{projectName}</h1>
        <span className="ml-2 text-foreground opacity-20">&#47;</span>
        {title && <strong className="mx-2 text-foreground">{title}</strong>}
        {children}
      </div>
    </header>
  );
}

interface IHeader extends PropsWithChildren {
  readonly title?: string;
}
