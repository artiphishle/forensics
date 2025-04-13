import { PropsWithChildren } from 'react';

export default function Header({ children, title }: IHeader) {
  return (
    <header className="flex flex-row bg-background p-4 gap-4">
      {title && <h1 className="text-foreground">{title}</h1>}
      {children}
    </header>
  );
}

interface IHeader extends PropsWithChildren {
  readonly title?: string;
}
