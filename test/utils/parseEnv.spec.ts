import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { parseEnv } from '@/utils/parseEnv';

describe('[parseEnv]', () => {
  // Parse '' to undefined
  it('parses "" correctly to undefined', () => {
    process.env.NEXT_PUBLIC_TEST = '';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);

    expect(result).toBeUndefined();
  });

  // Parse 'false' to boolean
  it('parses "false" correctly to boolean', () => {
    process.env.NEXT_PUBLIC_TEST = 'false';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);

    expect(result).toBe(false);
  });

  // Parse 'true' to boolean
  it('Parse "true" correctly to boolean', () => {
    process.env.NEXT_PUBLIC_TEST = 'true';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);

    expect(result).toBe(true);
  });

  // Throw error if not supported value
  it.skip('Throw error if not parseable', () => {
    process.env.NEXT_PUBLIC_TEST = 'invalid';

    const willThrow = () => parseEnv('test', process.env.NEXT_PUBLIC_TEST);

    expect(willThrow).toThrow('Invalid ENV value for: test');
  });
});
