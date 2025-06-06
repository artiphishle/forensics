import React from 'react';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { render } from '@artiphishle/testosterone/src/react/render';
import Breadcrumb from '@/components/Breadcrumb';

describe('Components', () => {
  it('renders the Breadcrumb', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = render(<Breadcrumb path="/myapp" onNavigate={() => {}} />);
    expect(getByText('myapp')).toBeDefined();
  });
});
