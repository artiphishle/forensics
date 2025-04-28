import React from 'react';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from 'testosterone/src/matchers';
import { render } from 'testosterone/src/react/render';
import Popover from '@/components/Popover';

describe('Components', () => {
  it('renders the Popover', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByTestId } = render(<Popover />);

    expect(getByTestId('popover')).toBeDefined();
  });
});
