import { PropsWithChildren } from 'react';

export default function Header({ children, title }: IHeader) {
  return (
    <header className="flex flex-row bg-blue-200 dark:bg-black p-4 gap-4">
      {title && <h1 className="text-black dark:text-white">{title}</h1>}
      {children}
    </header>
  );
}

interface IHeader extends PropsWithChildren {
  readonly title?: string;
}
