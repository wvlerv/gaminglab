package com.gaminglab.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findTop6ByOrderByIdDesc();
    List<Product> findTop12ByPopularTrueOrderByIdDesc();
    List<Product> findTop4ByCategoryIgnoreCaseAndIdNotOrderByIdDesc(String category, Long id);
    java.util.Optional<Product> findByNameIgnoreCase(String name);
}
