package com.gaminglab.product;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products")
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

    public Product() {}

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String name){this.name=name;}
    public String getCategory(){return category;} public void setCategory(String category){this.category=category;}
    public String getBrand(){return brand;} public void setBrand(String brand){this.brand=brand;}
    public String getPlatform(){return platform;} public void setPlatform(String platform){this.platform=platform;}
    public String getDescription(){return description;} public void setDescription(String description){this.description=description;}
    public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal price){this.price=price;}
    public Integer getDiscountPercent(){return discountPercent;} public void setDiscountPercent(Integer discountPercent){this.discountPercent=discountPercent==null?0:discountPercent;}
    public Integer getStock(){return stock;} public void setStock(Integer stock){this.stock=stock==null?0:stock;}
    public Boolean getInStock(){return inStock;} public void setInStock(Boolean inStock){this.inStock=inStock;}
    public Boolean getIsNew(){return isNew;} public void setIsNew(Boolean isNew){this.isNew=isNew;}
    public Boolean getPopular(){return popular;} public void setPopular(Boolean popular){this.popular=popular;}
    public String getImageUrl(){return imageUrl;} public void setImageUrl(String imageUrl){this.imageUrl=imageUrl;}
    public String getLongDescription(){return longDescription;} public void setLongDescription(String longDescription){this.longDescription=longDescription;}
    public java.math.BigDecimal getRating(){return rating;} public void setRating(java.math.BigDecimal rating){this.rating=rating;}
    public Integer getReviewCount(){return reviewCount;} public void setReviewCount(Integer reviewCount){this.reviewCount=reviewCount==null?0:reviewCount;}
    public String getWeight(){return weight;} public void setWeight(String weight){this.weight=weight;}
    public String getConnection(){return connection;} public void setConnection(String connection){this.connection=connection;}
    public String getSensor(){return sensor;} public void setSensor(String sensor){this.sensor=sensor;}
    public String getBattery(){return battery;} public void setBattery(String battery){this.battery=battery;}
    public Set<String> getCompatibility(){return compatibility;} public void setCompatibility(Set<String> compatibility){this.compatibility=compatibility;}
    public Set<String> getColors(){return colors;} public void setColors(Set<String> colors){this.colors=colors;}
    public Set<String> getFeatures(){return features;} public void setFeatures(Set<String> features){this.features=features;}
}
