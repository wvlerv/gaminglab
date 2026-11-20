package com.gaminglab.product;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ProductDataInitializer implements CommandLineRunner {
    private final ProductRepository repository;


    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        save("Viper V3 Pro", "Mouse", "Razer", "PC", "Ultralight. Unstoppable.",
            "6599", 0, true, true, true, 20,
            "The Razer Viper V3 Pro delivers tournament-grade tracking and ultra-fast wireless response in an ultra-lightweight 59 g body.",
            "59 g", "Wireless", "30K optical sensor, 8000 Hz polling", "Up to 95 hours",
            Set.of("PC", "PlayStation 5", "Xbox Series X/S", "Nintendo Switch"),
            Set.of("#C8FF24", "#FFFFFF"), Set.of("Wireless", "Ultra-lightweight", "RGB lighting", "High-precision sensor"),
            "4.80", 25, "/images/products/viper-v3-pro.png");

        save("Logitech G PRO X 2", "Headsets", "Logitech", "PC", "Immersive audio experience.",
            "10999", 0, true, true, true, 30,
            "Professional wireless headset with graphene drivers, clear directional sound and a detachable broadcast-quality microphone.",
            "318 g", "Wireless / USB / 3.5 mm", "Graphene 50 mm drivers", "Up to 50 hours",
            Set.of("PC", "PlayStation 5", "Nintendo Switch"),
            Set.of("#000000", "#FFFFFF"), Set.of("Wireless", "Bluetooth", "Detachable microphone", "Surround sound"),
            "4.70", 18, "/images/products/logitech-g-pro-x-2.png");

        save("Hator Rockfall 3", "Keyboards", "Hator", "PC", "Wireless mechanical precision.",
            "4499", 15, true, true, false, 18,
            "Compact wireless mechanical keyboard with tactile switches, per-key RGB backlighting and a durable aluminum top frame.",
            "790 g", "2.4 GHz wireless / USB-C", "Hator HS Optic switches", "Up to 100 hours",
            Set.of("PC", "PlayStation 5", "Xbox Series X/S"),
            Set.of("#111111", "#C8FF24"), Set.of("Wireless", "RGB lighting", "Mechanical switches", "Hot-swappable"),
            "4.60", 42, "/images/products/hator-rockfall-3.png");

        save("DualSense Edge", "Controllers", "Sony", "PlayStation 5", "Pro-level control and customization.",
            "9299", 0, true, true, true, 12,
            "Premium PlayStation 5 controller with replaceable stick modules, adjustable triggers and programmable rear buttons.",
            "325 g", "Wireless / USB-C", "Dual actuators and adaptive triggers", "Up to 10 hours",
            Set.of("PlayStation 5", "PC"),
            Set.of("#FFFFFF", "#111111"), Set.of("Wireless", "Bluetooth", "Custom profiles", "Adaptive triggers", "Replaceable sticks"),
            "4.50", 31, "/images/products/dualsense-edge.png");

        save("Razer Basilisk V3", "Mouse", "Razer", "PC", "Ergonomic, customizable gaming mouse.",
            "3799", 0, true, false, false, 8,
            "Ergonomic RGB gaming mouse with an iconic thumb rest, customizable scroll resistance and precise optical tracking.",
            "101 g", "Wired USB", "26K optical sensor", "Not applicable",
            Set.of("PC"),
            Set.of("#111111", "#C8FF24"), Set.of("Wired", "RGB lighting", "Programmable buttons", "Ergonomic"),
            "4.40", 67, "/images/products/razer-basilisk-v3.png");

        save("SteelSeries Arctis Nova", "Headsets", "SteelSeries", "PlayStation 5", "High-fidelity wireless gaming headset.",
            "7999", 10, false, false, false, 0,
            "Comfortable wireless gaming headset with low-latency 2.4 GHz connection and clear noise-cancelling microphone.",
            "277 g", "2.4 GHz wireless / USB-C", "Nova acoustic system", "Up to 40 hours",
            Set.of("PC", "PlayStation 5", "Xbox Series X/S", "Nintendo Switch", "Mobile"),
            Set.of("#111111", "#FFFFFF"), Set.of("Wireless", "Bluetooth", "Noise-cancelling microphone", "Spatial audio"),
            "4.30", 36, "/images/products/steelseries-arctis-nova.png");

        save("Xbox Wireless Controller", "Controllers", "Microsoft", "Xbox Series X/S", "Wireless controller for Xbox and PC.",
            "2499", 0, true, false, false, 24,
            "Modern Xbox controller with textured grips, hybrid D-pad and low-latency wireless support for console and PC.",
            "287 g", "Wireless / USB-C", "Standard Hall-effectless analog sticks", "Up to 40 hours with replaceable batteries",
            Set.of("Xbox Series X/S", "PC", "Android", "iOS"),
            Set.of("#FFFFFF", "#111111", "#5F6FD6"), Set.of("Wireless", "Bluetooth", "Textured grips", "Share button"),
            "4.60", 54, "/images/products/xbox-wireless-controller.png");

        save("Nintendo Switch Pro Controller", "Controllers", "Nintendo", "Nintendo Switch", "Comfortable control for every play session.",
            "3499", 0, true, false, false, 16,
            "Ergonomic Nintendo Switch controller with motion control, HD rumble and NFC support for Amiibo.",
            "246 g", "Wireless Bluetooth / USB-C", "Motion sensors and HD rumble", "Up to 40 hours",
            Set.of("Nintendo Switch", "PC", "Android"),
            Set.of("#111111", "#FFFFFF"), Set.of("Wireless", "Bluetooth", "Motion control", "Amiibo NFC", "HD rumble"),
            "4.70", 73, "/images/products/nintendo-switch-pro-controller.png");

        save("Razer BlackWidow V4", "Keyboards", "Razer", "PC", "Mechanical keyboard with RGB lighting.",
            "6999", 0, true, false, false, 10,
            "Full-size mechanical keyboard with tactile switches, programmable macro keys and individually illuminated keys.",
            "1130 g", "Wired USB", "Razer Green mechanical switches", "Not applicable",
            Set.of("PC"),
            Set.of("#111111", "#C8FF24"), Set.of("Wired", "RGB lighting", "Mechanical switches", "Macro keys", "Media controls"),
            "4.40", 28, "/images/products/razer-blackwidow-v4.png");
    }

    private Product save(String name, String category, String brand, String platform, String description,
                        String price, int discount, boolean inStock, boolean isNew, boolean popular,
                        int stock, String longDescription, String weight, String connection,
                        String sensor, String battery, Set<String> compatibility, Set<String> colors,
                        Set<String> features, String rating, int reviewCount, String imageUrl) {
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setBrand(brand);
        p.setPlatform(platform);
        p.setDescription(description);
        p.setLongDescription(longDescription);
        p.setPrice(new BigDecimal(price));
        p.setDiscountPercent(discount);
        p.setInStock(inStock && stock > 0);
        p.setIsNew(isNew);
        p.setPopular(popular);
        p.setStock(stock);
        p.setImageUrl(imageUrl);
        p.setWeight(weight);
        p.setConnection(connection);
        p.setSensor(sensor);
        p.setBattery(battery);
        p.setCompatibility(compatibility);
        p.setColors(colors);
        p.setFeatures(features);
        p.setRating(new BigDecimal(rating));
        p.setReviewCount(reviewCount);
        return repository.save(p);
    }
}
