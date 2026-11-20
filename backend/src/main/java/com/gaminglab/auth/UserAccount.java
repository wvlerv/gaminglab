package com.gaminglab.auth;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class UserAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 32)
    private String phone;

    @Enumerated(EnumType.STRING)
    private com.gaminglab.order.Carrier preferredCarrier;

    @Column(length = 100)
    private String preferredCity;

    @Enumerated(EnumType.STRING)
    private com.gaminglab.order.DeliveryMethod preferredDeliveryMethod;

    @Column(length = 255)
    private String preferredDeliveryPoint;

    public UserAccount(String firstName, String lastName, String email, String passwordHash) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
    }
}