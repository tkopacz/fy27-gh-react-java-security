export interface OrderRequest {
  productId: number;
  quantity: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
}

export interface OrderResponse {
  orderId: string;
  status: string;
  message: string;
}
