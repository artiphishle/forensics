import { PropsWithChildren } from 'react';
import Settings from '@/components/Settings';

export default function Main({ children }: PropsWithChildren) {
  return (
    <main
      data-testid="main"
      className="flex flex-col md:flex-row bg-background dark:bg-gray-950 text-foreground flex-1"
    >
      <Settings />
      {children}
    </main>
  );
}
