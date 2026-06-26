package com.example.demo.order;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicLong;

@Service
public class OrderService {
    private final AtomicLong sequence = new AtomicLong(1000);

    public OrderResponse createOrder(OrderRequest request) {
        long orderId = sequence.incrementAndGet();
        return new OrderResponse("ORD-" + orderId, "CONFIRMED", "Order received for " + request.getProductId());
    }
}
