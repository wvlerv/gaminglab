package com.gaminglab.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;

    public Page<Product> search(String q, List<String> categories, List<String> brands,
                                List<String> platforms, List<String> features,
                                BigDecimal minPrice, BigDecimal maxPrice, Boolean inStock,
                                Pageable pageable) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (q != null && !q.trim().isEmpty()) {
                String value = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                var featureJoin = root.joinSet("features", jakarta.persistence.criteria.JoinType.LEFT);
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), value),
                    cb.like(cb.lower(root.get("brand")), value),
                    cb.like(cb.lower(root.get("category")), value),
                    cb.like(cb.lower(root.get("description")), value),
                    cb.like(cb.lower(featureJoin.as(String.class)), value)
                ));
            }
            if (categories != null && !categories.isEmpty()) predicates.add(root.get("category").in(categories));
            if (brands != null && !brands.isEmpty()) predicates.add(root.get("brand").in(brands));
            if (platforms != null && !platforms.isEmpty()) predicates.add(root.get("platform").in(platforms));
            if (features != null && !features.isEmpty()) {
                var featureJoin = root.join("features");
                predicates.add(featureJoin.in(features));
            }
            if (minPrice != null) predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            if (maxPrice != null) predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            if (Boolean.TRUE.equals(inStock)) predicates.add(cb.equal(root.get("inStock"), true));
            if (query != null) query.distinct(true);
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        return repository.findAll(spec, pageable);
    }

    public Optional<Product> findById(Long id) { return repository.findById(id); }
    public List<Product> newArrivals() { return repository.findTop6ByOrderByIdDesc(); }
    public List<Product> popular() { return repository.findTop12ByPopularTrueOrderByIdDesc(); }
    public List<Product> frequentlyBoughtTogether(Long id) {
        return findById(id)
            .map(product -> repository.findTop4ByCategoryIgnoreCaseAndIdNotOrderByIdDesc(product.getCategory(), id))
            .orElse(List.of());
    }

    public List<String> suggestions(String q, int limit) {
        if (q == null || q.trim().isEmpty()) return List.of();
        String needle = q.trim().toLowerCase(Locale.ROOT);
        LinkedHashSet<String> values = new LinkedHashSet<>();
        for (Product p : repository.findAll()) {
            if (p.getName().toLowerCase(Locale.ROOT).contains(needle)) values.add(p.getName());
            if (p.getBrand().toLowerCase(Locale.ROOT).contains(needle)) values.add(p.getBrand());
            if (p.getCategory().toLowerCase(Locale.ROOT).contains(needle)) values.add(p.getCategory());
            if (values.size() >= Math.max(limit, 1)) break;
        }
        return new ArrayList<>(values);
    }

    public ProductFilters filters() {
        List<Product> all = repository.findAll();
        return new ProductFilters(
            sorted(all.stream().map(Product::getCategory).filter(Objects::nonNull)),
            sorted(all.stream().map(Product::getBrand).filter(Objects::nonNull)),
            sorted(all.stream().map(Product::getPlatform).filter(Objects::nonNull)),
            sorted(all.stream().flatMap(p -> p.getFeatures().stream())));
    }

    private List<String> sorted(java.util.stream.Stream<String> values) {
        return values.filter(v -> !v.isBlank()).distinct().sorted(String.CASE_INSENSITIVE_ORDER).toList();
    }
}
