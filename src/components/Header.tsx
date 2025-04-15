import { PropsWithChildren } from 'react';

export default function Header({ children, title }: IHeader) {
  return (
    <header className="flex flex-row bg-sky-900 p-4 gap-4">
      {title && <strong className="text-background">{title}</strong>}
      {children}
    </header>
  );
}

interface IHeader extends PropsWithChildren {
  readonly title?: string;
}
