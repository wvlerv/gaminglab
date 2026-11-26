package com.gaminglab.order;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderDtos {
    public record CheckoutRequest(
        @NotBlank @Email String email,
        @NotBlank String phone,
        @NotNull Carrier carrier,
        @NotNull DeliveryMethod deliveryMethod,
        @NotBlank String city,
        String deliveryPoint,
        @NotBlank String recipientName,
        @NotNull PaymentMethod paymentMethod,
        String cardNumber,
        String cardExpiry,
        String cardCvc,
        String discountCode
    ) {}

    public record OrderItemResponse(Long productId, String name, String imageUrl, String color,
                                    Integer quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}
    public record DiscountPreviewRequest(
        String code,
        @NotNull DeliveryMethod deliveryMethod
    ) {}

    public record DiscountPreviewResponse(
        boolean valid,
        String message,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal shippingCost,
        BigDecimal total
    ) {}

    public record OrderResponse(Long id, String orderNumber, OrderStatus status, PaymentMethod paymentMethod,
                                BigDecimal subtotal, BigDecimal shippingCost, BigDecimal total,
                                String carrier, String deliveryMethod, String deliveryPoint,
                                Instant createdAt, List<OrderItemResponse> items) {}
}
