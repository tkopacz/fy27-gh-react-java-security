import { useEffect, useState } from 'react';
import { ApiError } from '../types/ApiError';
import { getProducts } from '../services/productsApi';

interface UseProductsResult {
  data: Array<{ id: number; name: string; price: number; imageUrl: string; inStock: boolean; descriptionHtml: string }>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useProducts(): UseProductsResult {
  const [data, setData] = useState<UseProductsResult['data']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getProducts(controller.signal)
      .then((products) => {
        setData(products);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem('authToken');
          window.location.assign('/login');
          return;
        }

        setError(err instanceof Error ? err.message : 'Unable to load products');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [refreshToken]);

  return {
    data,
    loading,
    error,
    refetch: () => setRefreshToken((value) => value + 1)
  };
}

export default useProducts;
