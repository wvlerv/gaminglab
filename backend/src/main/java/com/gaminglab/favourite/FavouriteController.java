package com.gaminglab.favourite;

import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class FavouriteController {
    private final FavouriteService service;

    @GetMapping
    public FavouriteDtos.FavouriteListResponse getAll() {
        return service.getAll();
    }

    @GetMapping("/products/{productId}/status")
    public FavouriteDtos.FavouriteStatusResponse getStatus(@PathVariable Long productId) {
        return service.getStatus(productId);
    }

    @PostMapping("/products/{productId}")
    public FavouriteDtos.FavouriteStatusResponse add(@PathVariable Long productId) {
        return service.add(productId);
    }

    @DeleteMapping("/products/{productId}")
    public FavouriteDtos.FavouriteStatusResponse remove(@PathVariable Long productId) {
        return service.remove(productId);
    }

    @DeleteMapping
    public ResponseEntity<Void> clear() {
        service.clear();
        return ResponseEntity.noContent().build();
    }
}
