package com.gaminglab.cart;

import com.gaminglab.auth.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByGuestId(String guestId);
    Optional<Cart> findByUser(UserAccount user);
}
