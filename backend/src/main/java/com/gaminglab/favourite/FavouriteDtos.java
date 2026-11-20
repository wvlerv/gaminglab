package com.gaminglab.favourite;

import java.math.BigDecimal;
import java.util.List;

public class FavouriteDtos {
    public record FavouriteResponse(Long id, Long productId, String name, String category,
                                    String brand, String imageUrl, BigDecimal price,
                                    Integer discountPercent, Boolean inStock, Integer stock) {}

    public record FavouriteListResponse(List<FavouriteResponse> items, BigDecimal totalValue,
                                        int availableCount) {}

    public record FavouriteStatusResponse(Long productId, boolean favourite) {}
}
