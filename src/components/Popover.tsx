'use client';
import { t } from '@/i18n/i18n';
import { MenuIcon } from 'lucide-react';
import { Popover as RadixPopover } from 'radix-ui';

export default function Popover() {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger>
        <MenuIcon />
      </RadixPopover.Trigger>
      <RadixPopover.Anchor />
      <RadixPopover.Portal>
        <RadixPopover.Content className="flex flex-col bg-background text-foreground">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="border-b border-b-gray-200 p-2" href="/">
            {t('nav.packages')}
          </a>
          <a className="p-2" href="sequence">
            {t('nav.sequence')}
          </a>
          <RadixPopover.Close />
          <RadixPopover.Arrow />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
