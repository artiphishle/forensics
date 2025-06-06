import React from 'react';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { render } from '@artiphishle/testosterone/src/react/render';
import Main from '@/components/Main';
import { SettingsProvider } from '@/contexts/SettingsContext';

describe('Components', () => {
  it('renders the Main', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByTestId } = render(
      <SettingsProvider>
        <Main />
      </SettingsProvider>
    );

    expect(getByTestId('main')).toBeDefined();
  });
});
