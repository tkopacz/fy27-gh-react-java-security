import { describe, expect, it } from 'vitest';
import { mergeObjectsSafely } from './SafeMerge';

describe('mergeObjectsSafely', () => {
  it('blocks prototype pollution keys', () => {
    const result = mergeObjectsSafely({}, { __proto__: { polluted: true } } as never);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(result).toEqual({});
  });

  it('merges normal values', () => {
    const result = mergeObjectsSafely({ theme: 'dark' }, { layout: 'compact' });
    expect(result).toEqual({ theme: 'dark', layout: 'compact' });
  });
});
