import type { Product } from '../types/Product';
import { request } from './apiClient';

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  return request<Product[]>('/api/products', { signal, method: 'GET' });
}
