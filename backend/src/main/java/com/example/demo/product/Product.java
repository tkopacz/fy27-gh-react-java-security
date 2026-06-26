package com.example.demo.product;

import java.math.BigDecimal;

public record Product(
        Long id,
        String name,
        BigDecimal price,
        String imageUrl,
        boolean inStock,
        String descriptionHtml
) {
}
