package com.example.demo.order;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderRequest {
    @NotNull(message = "must be provided")
    private Long productId;

    @NotNull(message = "must be provided")
    @Min(value = 1, message = "must be at least 1")
    private Integer quantity;

    @NotBlank(message = "must be provided")
    private String firstName;

    @NotBlank(message = "must be provided")
    private String lastName;

    @NotBlank(message = "must be provided")
    @Email(message = "must be a well-formed email address")
    private String email;

    @NotBlank(message = "must be provided")
    private String phone;

    @NotBlank(message = "must be provided")
    private String deliveryAddress;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}
