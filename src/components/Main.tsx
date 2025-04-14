import { PropsWithChildren } from 'react';
import Settings from '@/components/Settings';

export default function Main({ children }: IMain) {
  return (
    <main className="flex flex-row bg-background text-foreground flex-1">
      <Settings />
      {children}
    </main>
  );
}

interface IMain extends PropsWithChildren {}
