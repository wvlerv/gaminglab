package com.gaminglab.order;

import com.gaminglab.auth.JwtService;
import com.gaminglab.auth.UserAccount;
import com.gaminglab.auth.UserRepository;
import com.gaminglab.cart.Cart;
import com.gaminglab.cart.CartItem;
import com.gaminglab.cart.CartRepository;
import com.gaminglab.product.Product;
import com.gaminglab.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private static final BigDecimal COURIER_COST = new BigDecimal("120.00");

    private final CartRepository carts;
    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;
    private final com.gaminglab.auth.CurrentUserService currentUser;

    @Transactional
    public OrderDtos.OrderResponse checkout(String guestId, OrderDtos.CheckoutRequest request) {
        Cart cart = resolveCart(guestId);
        if (cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            Product product = products.findById(cartItem.getProduct().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
            if (!Boolean.TRUE.equals(product.getInStock()) || product.getStock() < cartItem.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Insufficient stock for: " + product.getName());
            }
            subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        if (request.discountCode() != null && !request.discountCode().isBlank()
            && "promocode13124122".equalsIgnoreCase(request.discountCode().trim())) {
            subtotal = subtotal.multiply(new BigDecimal("0.90")).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal shippingCost = shippingCost(request);

        CustomerOrder order = new CustomerOrder();
        order.setOrderNumber("GL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUser(cart.getUser());
        order.setEmail(request.email().trim());
        order.setPhone(request.phone().trim());
        order.setCarrier(request.carrier());
        order.setCity(request.city().trim());
        order.setDeliveryMethod(request.deliveryMethod());
        order.setDeliveryPoint(request.deliveryPoint());
        order.setRecipientName(request.recipientName().trim());
        order.setPaymentMethod(request.paymentMethod());
        order.setStatus(request.paymentMethod() == PaymentMethod.CARD_ONLINE
            ? OrderStatus.CONFIRMED : OrderStatus.CREATED);
        order.setSubtotal(subtotal);
        order.setShippingCost(shippingCost);
        order.setTotal(subtotal.add(shippingCost));

        for (CartItem cartItem : cart.getItems()) {
            Product product = products.findById(cartItem.getProduct().getId()).orElseThrow();
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setColor(cartItem.getColor());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setLineTotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            order.getItems().add(orderItem);

            product.setStock(product.getStock() - cartItem.getQuantity());
            product.setInStock(product.getStock() > 0);
            products.save(product);
        }

        CustomerOrder saved = orders.save(order);
        carts.delete(cart);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public java.util.List<OrderDtos.OrderResponse> getMyOrders(String status) {
        UserAccount user = currentUser.getRequiredUser();
        java.util.List<CustomerOrder> found;
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
            found = orders.findByUserOrderByCreatedAtDesc(user);
        } else {
            OrderStatus parsed;
            try {
                parsed = OrderStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status");
            }
            found = orders.findByUserAndStatusOrderByCreatedAtDesc(user, parsed);
        }
        return found.stream().map(this::toResponse).toList();
    }

    @Transactional
    public OrderDtos.OrderResponse cancel(String orderNumber) {
        UserAccount user = currentUser.getRequiredUser();
        CustomerOrder order = orders.findByOrderNumber(orderNumber)
            .filter(value -> value.getUser() != null && value.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED
            || order.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order cannot be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            product.setInStock(true);
            products.save(product);
        }
        return toResponse(orders.save(order));
    }

    @Transactional(readOnly = true)
    public OrderDtos.OrderResponse getByNumber(String orderNumber) {
        return orders.findByOrderNumber(orderNumber)
            .map(this::toResponse)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    private Cart resolveCart(String guestId) {
        UserAccount user = currentUser.getUserOrNull();
        if (user != null) {
            return carts.findByUser(user).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty"));
        }
        if (guestId == null || guestId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-Cart-Id is required");
        }
        return carts.findByGuestId(guestId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty"));
    }

    private BigDecimal shippingCost(OrderDtos.CheckoutRequest request) {
        if (request.deliveryMethod() == DeliveryMethod.PICKUP
            || request.deliveryMethod() == DeliveryMethod.BRANCH) {
            return BigDecimal.ZERO;
        }
        return COURIER_COST;
    }

    private OrderDtos.OrderResponse toResponse(CustomerOrder order) {
        var items = order.getItems().stream().map(item -> new OrderDtos.OrderItemResponse(
            item.getProduct().getId(), item.getProduct().getName(), item.getProduct().getImageUrl(),
            item.getColor(), item.getQuantity(), item.getUnitPrice(), item.getLineTotal()
        )).toList();
        return new OrderDtos.OrderResponse(order.getId(), order.getOrderNumber(), order.getStatus(),
            order.getPaymentMethod(), order.getSubtotal(), order.getShippingCost(), order.getTotal(),
            order.getCarrier().name(), order.getDeliveryMethod().name(), order.getDeliveryPoint(),
            order.getCreatedAt(), items);
    }
}
