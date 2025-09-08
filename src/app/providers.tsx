'use client';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/contexts/SettingsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SettingsProvider>{children}</SettingsProvider>
    </ThemeProvider>
  );
}
