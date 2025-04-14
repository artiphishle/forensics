import { parseEnv } from '@/utils/parseEnv';
import assert from 'node:assert';
import test, { describe } from 'node:test';

describe('[parseEnv]', () => {
  // Parse '' to undefined
  test('Parse "" correctly to undefined', () => {
    process.env.NEXT_PUBLIC_TEST = '';
    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    assert.strictEqual(result, undefined);
  });

  // Parse 'false' to boolean
  test('Parse "false" correctly to boolean', () => {
    process.env.NEXT_PUBLIC_TEST = 'false';
    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    assert.strictEqual(result, false);
  });

  // Parse 'true' to boolean
  test('Parse "true" correctly to boolean', () => {
    process.env.NEXT_PUBLIC_TEST = 'true';
    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    assert.strictEqual(result, true);
  });

  // Throw error if not supported value
  test('Throw error if not parseable', () => {
    process.env.NEXT_PUBLIC_TEST = 'invalid';
    const willThrow = () => parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    assert.throws(() => willThrow(), { message: 'Invalid ENV value for: test' });
  });
});
