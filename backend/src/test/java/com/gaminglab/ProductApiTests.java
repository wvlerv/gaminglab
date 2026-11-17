package com.gaminglab;

import com.gaminglab.product.Product;
import com.gaminglab.product.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:product-api-tests;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ProductApiTests {
    @Autowired MockMvc mvc;
    @Autowired ProductRepository repository;

    @BeforeEach
    void setUpProducts() {
        repository.deleteAll();

        repository.save(product("Viper V3 Pro", "Mouse", "Razer", "6599", "Wireless", "PC"));
        repository.save(product("Wireless Headset", "Headsets", "Logitech", "10999", "Wireless", "PC"));
    }

    @Test
    void searchesAndFiltersProducts() throws Exception {
        mvc.perform(get("/api/products").param("q", "wireless").param("category", "Mouse"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].name").value("Viper V3 Pro"));

        mvc.perform(get("/api/products").param("brand", "Razer").param("maxPrice", "7000"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void providesSuggestionsAndFilterOptions() throws Exception {
        mvc.perform(get("/api/products/suggestions").param("q", "wire"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0]").value("Wireless Headset"));

        mvc.perform(get("/api/products/filters"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.categories").isArray())
            .andExpect(jsonPath("$.categories[?(@ == 'Mouse')]").exists())
            .andExpect(jsonPath("$.brands[?(@ == 'Razer')]").exists());
    }

    private Product product(String name, String category, String brand, String price,
                            String feature, String platform) {
        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setBrand(brand);
        product.setPrice(new BigDecimal(price));
        product.setPlatform(platform);
        product.setInStock(true);
        product.setStock(10);
        product.setFeatures(Set.of(feature));
        return product;
    }
}
