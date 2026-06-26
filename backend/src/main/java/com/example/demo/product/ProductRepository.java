package com.example.demo.product;

import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public class ProductRepository {
    private final List<Product> products = List.of(
            new Product(1L, "Aurora Backpack", new BigDecimal("149.00"), "/images/aurora-backpack.jpg", true, "<strong>Lightweight</strong> carry-all for daily travel."),
            new Product(2L, "Nimbus Lamp", new BigDecimal("79.50"), "/images/nimbus-lamp.jpg", true, "<em>Soft ambient glow</em> for modern interiors."),
            new Product(3L, "Harbor Desk", new BigDecimal("329.00"), "/images/harbor-desk.jpg", false, "<span>Compact workspace</span> ready for hybrid teams."),
            new Product(4L, "Cove Headphones", new BigDecimal("199.00"), "/images/cove-headphones.jpg", true, "<b>Immersive audio</b> with studio-grade comfort.")
    );

    public List<Product> findAll() {
        return products;
    }

    public Optional<Product> findById(Long id) {
        return products.stream().filter(product -> product.id().equals(id)).findFirst();
    }
}
