package com.gaminglab.cart;

import com.gaminglab.auth.UserAccount;
import com.gaminglab.auth.UserRepository;
import com.gaminglab.product.Product;
import com.gaminglab.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository carts;
    private final CartItemRepository cartItems;
    private final ProductRepository products;
    private final UserRepository users;
    private final com.gaminglab.auth.CurrentUserService currentUser;

    @Transactional
    public CartDtos.CartResponse getCart(String guestId) {
        return toResponse(resolveCart(guestId));
    }

    @Transactional
    public CartDtos.CartResponse addItem(String guestId, CartDtos.AddItemRequest request) {
        Cart cart = resolveCart(guestId);
        Product product = products.findById(request.productId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (!Boolean.TRUE.equals(product.getInStock()) || product.getStock() < request.quantity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested quantity is not available");
        }

        CartItem item = cart.getItems().stream()
            .filter(existing -> existing.getProduct().getId().equals(request.productId()))
            .filter(existing -> java.util.Objects.equals(existing.getColor(), request.color()))
            .findFirst()
            .orElseGet(() -> {
                CartItem newItem = new CartItem();
                newItem.setCart(cart);
                newItem.setProduct(product);
                newItem.setColor(request.color());
                newItem.setQuantity(0);
                cart.getItems().add(newItem);
                return newItem;
            });

        int quantity = item.getQuantity() + request.quantity();
        if (quantity > product.getStock()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested quantity is not available");
        }
        item.setQuantity(quantity);
        carts.save(cart);
        return toResponse(cart);
    }

    @Transactional
    public CartDtos.CartResponse updateItem(String guestId, Long itemId, CartDtos.UpdateItemRequest request) {
        Cart cart = resolveCart(guestId);
        CartItem item = cartItems.findById(itemId)
            .filter(value -> value.getCart().getId().equals(cart.getId()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (request.quantity() > item.getProduct().getStock()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested quantity is not available");
        }
        item.setQuantity(request.quantity());
        carts.save(cart);
        return toResponse(cart);
    }

    @Transactional
    public CartDtos.CartResponse removeItem(String guestId, Long itemId) {
        Cart cart = resolveCart(guestId);
        CartItem item = cartItems.findById(itemId)
            .filter(value -> value.getCart().getId().equals(cart.getId()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        cart.getItems().remove(item);
        carts.save(cart);
        return toResponse(cart);
    }

    @Transactional
    public void mergeGuestCart(String guestId) {
        if (guestId == null) return;
        Cart guestCart = carts.findByGuestId(guestId).orElse(null);
        if (guestCart == null) return;

        UserAccount user = currentUser.getRequiredUser();
        Cart userCart = carts.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return carts.save(cart);
        });

        for (CartItem guestItem : guestCart.getItems()) {
            CartItem existing = userCart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(guestItem.getProduct().getId()))
                .filter(item -> java.util.Objects.equals(item.getColor(), guestItem.getColor()))
                .findFirst()
                .orElse(null);
            if (existing == null) {
                CartItem item = new CartItem();
                item.setCart(userCart);
                item.setProduct(guestItem.getProduct());
                item.setColor(guestItem.getColor());
                item.setQuantity(guestItem.getQuantity());
                userCart.getItems().add(item);
            } else {
                existing.setQuantity(existing.getQuantity() + guestItem.getQuantity());
            }
        }
        carts.save(userCart);
        carts.delete(guestCart);
    }

    private Cart resolveCart(String guestId) {
        UserAccount user = currentUser.getUserOrNull();
        if (user != null) {
            return carts.findByUser(user).orElseGet(() -> {
                Cart cart = new Cart();
                cart.setUser(user);
                return carts.save(cart);
            });
        }

        if (guestId == null || guestId.isBlank()) {
            Cart cart = new Cart();
            cart.setGuestId(UUID.randomUUID().toString());
            return carts.save(cart);
        }
        return carts.findByGuestId(guestId).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setGuestId(guestId);
            return carts.save(cart);
        });
    }


    private CartDtos.CartResponse toResponse(Cart cart) {
        var items = cart.getItems().stream()
            .map(item -> {
                BigDecimal price = item.getProduct().getPrice();
                return new CartDtos.CartItemResponse(
                    item.getId(), item.getProduct().getId(), item.getProduct().getName(),
                    item.getProduct().getImageUrl(), item.getColor(), item.getQuantity(), price,
                    price.multiply(BigDecimal.valueOf(item.getQuantity())));
            }).toList();
        BigDecimal subtotal = items.stream().map(CartDtos.CartItemResponse::lineTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        int itemCount = items.stream().mapToInt(CartDtos.CartItemResponse::quantity).sum();
        return new CartDtos.CartResponse(cart.getGuestId(), items, subtotal, itemCount);
    }
}
