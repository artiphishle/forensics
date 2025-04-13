import { PropsWithChildren } from 'react';
import Settings from '@/components/Settings';

export default function Main({ children }: IMain) {
  return (
    <main className="flex flex-row bg-background text-foreground h-full py-6">
      <Settings />
      {children}
    </main>
  );
}

interface IMain extends PropsWithChildren {}
