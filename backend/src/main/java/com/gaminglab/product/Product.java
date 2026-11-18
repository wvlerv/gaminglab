package com.gaminglab.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private String name;
    @Column(nullable=false)
    private String category;
    @Column(nullable=false)
    private String brand;
    private String platform;
    @Column(length=2000)
    private String description;
    @Column(nullable=false, precision=12, scale=2)
    private BigDecimal price;
    private Integer discountPercent = 0;
    private Integer stock = 0;
    private Boolean inStock = true;
    private Boolean isNew = false;
    private Boolean popular = false;
    private String imageUrl;
    @Column(length=2000)
    private String longDescription;
    @Column(precision=3, scale=2)
    private java.math.BigDecimal rating;
    private Integer reviewCount = 0;
    private String weight;
    private String connection;
    private String sensor;
    private String battery;

    @ElementCollection(fetch=FetchType.EAGER)
    @CollectionTable(name="product_compatibility", joinColumns=@JoinColumn(name="product_id"))
    @Column(name="compatibility")
    private Set<String> compatibility = new HashSet<>();

    @ElementCollection(fetch=FetchType.EAGER)
    @CollectionTable(name="product_colors", joinColumns=@JoinColumn(name="product_id"))
    @Column(name="color")
    private Set<String> colors = new HashSet<>();

    @ElementCollection(fetch=FetchType.EAGER)
    @CollectionTable(name="product_features", joinColumns=@JoinColumn(name="product_id"))
    @Column(name="feature")
    private Set<String> features = new HashSet<>();


}
