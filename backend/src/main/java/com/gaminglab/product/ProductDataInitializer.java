package com.gaminglab.product;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Set;

@Component
public class ProductDataInitializer implements CommandLineRunner {
    private final ProductRepository repository;

    public ProductDataInitializer(ProductRepository repository) { this.repository = repository; }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;
        Product viper = save("Viper V3 Pro", "Mouse", "Razer", "PC", "Ultralight. Unstoppable.", "6599", 0, true, true, true, 20, "Wireless", "RGB lighting");
        viper.setLongDescription("The Viper V3 Pro is engineered for precision, speed, and total control. With an ultra-lightweight design and industry-leading components, it is built to perform at the highest level — in every session.");
        viper.setRating(new BigDecimal("4.80")); viper.setReviewCount(25); viper.setWeight("59g");
        viper.setConnection("Wireless"); viper.setSensor("30K DPI"); viper.setBattery("Up to 95h");
        viper.setCompatibility(Set.of("PC", "PlayStation 5", "Xbox Series X/S", "Nintendo Switch"));
        viper.setColors(Set.of("#C8FF24", "#FFFFFF")); repository.save(viper);
        save("Logitech G PRO X 2", "Headsets", "Logitech", "PC", "Immersive audio experience.", "10999", 0, true, true, true, 30, "Wireless", "Bluetooth");
        save("Hator Rockfall 3", "Keyboards", "Hator", "PC", "Wireless mechanical precision.", "4499", 15, true, true, false, 18, "Wireless", "RGB lighting");
        save("DualSense Edge", "Controllers", "Sony", "PlayStation 5", "Pro-level control and customization.", "9299", 0, true, true, true, 12, "Wireless", "Bluetooth");
        save("Razer Basilisk V3", "Mouse", "Razer", "PC", "Ergonomic, customizable gaming mouse.", "3799", 0, false, false, false, 8, "Wired", "RGB lighting");
        save("SteelSeries Arctis Nova", "Headsets", "SteelSeries", "PlayStation 5", "High-fidelity wireless gaming headset.", "7999", 10, false, false, false, 0, "Wireless", "Bluetooth");
        save("Xbox Wireless Controller", "Controllers", "Microsoft", "Xbox Series X/S", "Wireless controller for Xbox and PC.", "2499", 0, true, false, false, 24, "Wireless", "Bluetooth");
        save("Nintendo Switch Pro Controller", "Controllers", "Nintendo", "Nintendo Switch", "Comfortable control for every play session.", "3499", 0, true, false, false, 16, "Wireless", "Bluetooth");
        save("Razer BlackWidow V4", "Keyboards", "Razer", "PC", "Mechanical keyboard with RGB lighting.", "6999", 0, true, false, false, 10, "Wired", "RGB lighting");
    }

    private Product save(String name, String category, String brand, String platform, String description,
                      String price, int discount, boolean inStock, boolean isNew, boolean popular,
                      int stock, String... features) {
        Product p = new Product();
        p.setName(name); p.setCategory(category); p.setBrand(brand); p.setPlatform(platform);
        p.setDescription(description); p.setPrice(new BigDecimal(price)); p.setDiscountPercent(discount);
        p.setInStock(inStock); p.setIsNew(isNew); p.setPopular(popular); p.setStock(stock);
        p.setFeatures(Set.of(features));
        return repository.save(p);
    }
}
