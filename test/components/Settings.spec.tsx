import React from 'react';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from 'testosterone/src/matchers';
import { render } from 'testosterone/src/react/render';
import { t } from '@/i18n/i18n';
import { SettingsProvider } from '@/contexts/SettingsContext';
import Settings from '@/components/Settings';

describe('Components', () => {
  it('renders the Settings', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = render(
      <SettingsProvider>
        <Settings />
      </SettingsProvider>
    );

    expect(getByText(t('settings.showSubPackages'))).toBeDefined();
  });
});
