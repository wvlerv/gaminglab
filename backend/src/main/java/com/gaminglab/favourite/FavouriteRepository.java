package com.gaminglab.favourite;

import com.gaminglab.auth.UserAccount;
import com.gaminglab.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    List<Favourite> findByUserOrderByIdDesc(UserAccount user);
    Optional<Favourite> findByUserAndProduct(UserAccount user, Product product);
    boolean existsByUserAndProduct(UserAccount user, Product product);
    void deleteByUser(UserAccount user);
}
