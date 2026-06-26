import { describe, expect, it } from 'vitest';
import { getSafeRedirectPath } from './SafeRedirect';

describe('getSafeRedirectPath', () => {
  it('allows relative paths', () => {
    expect(getSafeRedirectPath('/products')).toBe('/products');
  });

  it('rejects external urls', () => {
    expect(getSafeRedirectPath('https://evil.example')).toBeNull();
  });
});
