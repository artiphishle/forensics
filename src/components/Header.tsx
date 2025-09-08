import React, { PropsWithChildren } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header({ children, title }: IHeader) {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH || '{Unknown}';
  const projectName = projectPath.split(/[\\/]/).pop(); // Backslash for Windows paths

  return (
    <header className="flex flex-row items-center justify-between text-blue-50 bg-blue-500 dark:bg-blue-950 border-b-1 border-b-neutral-200 mb-1 dark:border-b-blue-800 p-2 pb-1 gap-4">
      <div className="flex flex-row items-center justify-start">
        <h1 className="ml-4">{projectName}</h1>
        <span className="ml-2 opacity-20">&#47;</span>
        {title && <strong className="mx-2">{title}</strong>}
        {children}
      </div>
      <ThemeToggle />
    </header>
  );
}

interface IHeader extends PropsWithChildren {
  readonly title?: string;
}
