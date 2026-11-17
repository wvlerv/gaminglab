package com.gaminglab.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins={"http://localhost:3000","http://localhost:5173"})
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) { this.service = service; }

    @GetMapping
    public Page<Product> search(@RequestParam(required=false) String q,
                                @RequestParam(required=false) List<String> category,
                                @RequestParam(required=false) List<String> brand,
                                @RequestParam(required=false) List<String> platform,
                                @RequestParam(required=false) List<String> feature,
                                @RequestParam(required=false) BigDecimal minPrice,
                                @RequestParam(required=false) BigDecimal maxPrice,
                                @RequestParam(required=false) Boolean inStock,
                                @RequestParam(required=false, defaultValue="popular") String sort,
                                @RequestParam(defaultValue="0") int page,
                                @RequestParam(defaultValue="12") int size) {
        Sort sorting = switch (sort) {
            case "newest" -> Sort.by(Sort.Direction.DESC, "id");
            case "price-asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price-desc" -> Sort.by(Sort.Direction.DESC, "price");
            default -> Sort.by(Sort.Direction.DESC, "popular").and(Sort.by(Sort.Direction.DESC, "id"));
        };
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), sorting);
        return service.search(q, category, brand, platform, feature, minPrice, maxPrice, inStock, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/new")
    public List<Product> newArrivals() { return service.newArrivals(); }

    @GetMapping("/popular")
    public List<Product> popular() { return service.popular(); }

    @GetMapping("/{id}/frequently-bought-together")
    public ResponseEntity<List<Product>> frequentlyBoughtTogether(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.frequentlyBoughtTogether(id));
    }

    @GetMapping("/suggestions")
    public List<String> suggestions(@RequestParam String q, @RequestParam(defaultValue="5") int limit) {
        return service.suggestions(q, limit);
    }

    @GetMapping("/filters")
    public ProductFilters filters() { return service.filters(); }
}
