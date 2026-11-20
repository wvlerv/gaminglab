package com.gaminglab.favourite;

import com.gaminglab.auth.JwtService;
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
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouriteService {
    private final FavouriteRepository favourites;
    private final UserRepository users;
    private final ProductRepository products;
    private final com.gaminglab.auth.CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public FavouriteDtos.FavouriteListResponse getAll() {
        UserAccount user = currentUser.getRequiredUser();
        List<FavouriteDtos.FavouriteResponse> items = favourites.findByUserOrderByIdDesc(user).stream()
            .map(this::toResponse)
            .toList();

        BigDecimal total = items.stream()
            .map(FavouriteDtos.FavouriteResponse::price)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        int available = (int) items.stream()
            .filter(value -> Boolean.TRUE.equals(value.inStock()) && value.stock() > 0)
            .count();
        return new FavouriteDtos.FavouriteListResponse(items, total, available);
    }

    @Transactional
    public FavouriteDtos.FavouriteStatusResponse add(Long productId) {
        UserAccount user = currentUser.getRequiredUser();
        Product product = products.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (!favourites.existsByUserAndProduct(user, product)) {
            Favourite favourite = new Favourite();
            favourite.setUser(user);
            favourite.setProduct(product);
            favourites.save(favourite);
        }
        return new FavouriteDtos.FavouriteStatusResponse(productId, true);
    }

    @Transactional
    public FavouriteDtos.FavouriteStatusResponse remove(Long productId) {
        UserAccount user = currentUser.getRequiredUser();
        Product product = products.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        favourites.findByUserAndProduct(user, product).ifPresent(favourites::delete);
        return new FavouriteDtos.FavouriteStatusResponse(productId, false);
    }

    @Transactional
    public void clear() {
        favourites.deleteByUser(currentUser.getRequiredUser());
    }

    @Transactional(readOnly = true)
    public FavouriteDtos.FavouriteStatusResponse getStatus(Long productId) {
        UserAccount user = currentUser.getRequiredUser();
        Product product = products.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return new FavouriteDtos.FavouriteStatusResponse(productId,
            favourites.existsByUserAndProduct(user, product));
    }

    private FavouriteDtos.FavouriteResponse toResponse(Favourite favourite) {
        Product product = favourite.getProduct();
        return new FavouriteDtos.FavouriteResponse(
            favourite.getId(), product.getId(), product.getName(), product.getCategory(), product.getBrand(),
            product.getImageUrl(), product.getPrice(), product.getDiscountPercent(),
            product.getInStock(), product.getStock());
    }

}
