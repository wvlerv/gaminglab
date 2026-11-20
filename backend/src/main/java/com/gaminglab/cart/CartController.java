package com.gaminglab.cart;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService service;

    @GetMapping
    public CartDtos.CartResponse get(@RequestHeader(value = "X-Cart-Id", required = false) String guestId) {
        return service.getCart(guestId);
    }

    @PostMapping("/items")
    public CartDtos.CartResponse add(@RequestHeader(value = "X-Cart-Id", required = false) String guestId,
                                     @Valid @RequestBody CartDtos.AddItemRequest request) {
        return service.addItem(guestId, request);
    }

    @PatchMapping("/items/{itemId}")
    public CartDtos.CartResponse update(@RequestHeader(value = "X-Cart-Id", required = false) String guestId,
                                        @PathVariable Long itemId,
                                        @Valid @RequestBody CartDtos.UpdateItemRequest request) {
        return service.updateItem(guestId, itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public CartDtos.CartResponse remove(@RequestHeader(value = "X-Cart-Id", required = false) String guestId,
                                        @PathVariable Long itemId) {
        return service.removeItem(guestId, itemId);
    }

    @PostMapping("/merge")
    @SecurityRequirement(name = "bearerAuth")
    public void merge(@RequestHeader("X-Cart-Id") String guestId) {
        service.mergeGuestCart(guestId);
    }
}
