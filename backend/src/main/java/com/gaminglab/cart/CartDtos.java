package com.gaminglab.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class CartDtos {
    public record AddItemRequest(@NotNull Long productId, @NotNull @Min(1) Integer quantity, String color) {}
    public record UpdateItemRequest(@NotNull @Min(1) Integer quantity) {}

    public record CartItemResponse(Long id, Long productId, String name, String imageUrl, String color,
                                   Integer quantity, BigDecimal price, BigDecimal lineTotal) {}
    public record CartResponse(String cartId, List<CartItemResponse> items, BigDecimal subtotal,
                               Integer itemCount) {}
}
