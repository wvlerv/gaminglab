package com.gaminglab.order;

import com.gaminglab.auth.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    Optional<CustomerOrder> findByOrderNumber(String orderNumber);
    List<CustomerOrder> findByUserOrderByCreatedAtDesc(UserAccount user);
    List<CustomerOrder> findByUserAndStatusOrderByCreatedAtDesc(UserAccount user, OrderStatus status);
}
