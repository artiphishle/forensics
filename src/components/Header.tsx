import Popover from '@/components/Popover';
import type { PropsWithChildren } from 'react';

export default function Header({ children, title }: IHeader) {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH || '{Unknown}';
  const projectName = projectPath.split('/').pop();

  return (
    <header className="flex flex-row items-center justify-between bg-sky-900 p-4 gap-4">
      <div className="flex flex-row items-center justify-start">
        <Popover />
        {title && <strong className="mx-4 text-background">{title}</strong>}
        {children}
      </div>
      <div>
        <h1>{projectName}</h1>
      </div>
    </header>
  );
}

interface IHeader extends PropsWithChildren {
  readonly title?: string;
}
