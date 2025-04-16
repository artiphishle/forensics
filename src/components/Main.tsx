import { PropsWithChildren } from 'react';
import Settings from '@/components/Settings';

export default function Main({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col md:flex-row bg-background text-foreground flex-1">
      <Settings />
      {children}
    </main>
  );
}
