package com.gaminglab.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService service;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDtos.OrderResponse> checkout(
        @RequestHeader(value = "X-Cart-Id", required = false) String guestId,
        @Valid @RequestBody OrderDtos.CheckoutRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.checkout(guestId, request));
    }

    @GetMapping("/my")
    @SecurityRequirement(name = "bearerAuth")
    public java.util.List<OrderDtos.OrderResponse> getMyOrders(
        @RequestParam(required = false) String status
    ) {
        return service.getMyOrders(status);
    }

    @PostMapping("/discount-preview")
    public OrderDtos.DiscountPreviewResponse previewDiscount(
        @RequestHeader(value = "X-Cart-Id", required = false) String guestId,
        @Valid @RequestBody OrderDtos.DiscountPreviewRequest request
    ) {
        return service.previewDiscount(guestId, request);
    }

    @PostMapping("/{orderNumber}/cancel")
    @SecurityRequirement(name = "bearerAuth")
    public OrderDtos.OrderResponse cancel(@PathVariable String orderNumber) {
        return service.cancel(orderNumber);
    }

    @GetMapping("/{orderNumber}")
    public OrderDtos.OrderResponse get(@PathVariable String orderNumber) {
        return service.getByNumber(orderNumber);
    }
}
