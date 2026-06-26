import type { OrderRequest, OrderResponse } from '../types/Order';
import { request } from './apiClient';

export async function createOrder(order: OrderRequest): Promise<OrderResponse> {
  return request<OrderResponse>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order)
  });
}
