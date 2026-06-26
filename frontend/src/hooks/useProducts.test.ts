import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useProducts from './useProducts';
import { getProducts } from '../services/productsApi';

vi.mock('../services/productsApi', () => ({
  getProducts: vi.fn()
}));

const mockedGetProducts = vi.mocked(getProducts);

describe('useProducts', () => {
  beforeEach(() => {
    mockedGetProducts.mockReset();
  });

  it('returns products when the API resolves', async () => {
    mockedGetProducts.mockResolvedValue([{ id: 1, name: 'Tea', price: 19.99, imageUrl: '', inStock: true, descriptionHtml: 'demo' }]);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });
});
