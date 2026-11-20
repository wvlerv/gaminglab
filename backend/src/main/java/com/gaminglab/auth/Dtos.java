package com.gaminglab.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class Dtos {
    public record SignupRequest(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        boolean acceptedTerms
    ) {}

    public record LoginRequest(
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(max = 72) String password,
        boolean rememberMe
    ) {}

    public record AuthResponse(String accessToken, String tokenType, UserResponse user) {}
    public record UserResponse(Long id, String firstName, String lastName, String email) {}

    public record ProfileRequest(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        @Size(max = 32) String phone
    ) {}

    public record DeliveryPreferencesRequest(
        com.gaminglab.order.Carrier carrier,
        @Size(max = 100) String city,
        com.gaminglab.order.DeliveryMethod deliveryMethod,
        @Size(max = 255) String deliveryPoint
    ) {}

    public record ChangePasswordRequest(
        @NotBlank String currentPassword,
        @NotBlank @Size(min = 8, max = 72) String newPassword
    ) {}

    public record ProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        com.gaminglab.order.Carrier preferredCarrier,
        String preferredCity,
        com.gaminglab.order.DeliveryMethod preferredDeliveryMethod,
        String preferredDeliveryPoint
    ) {}
}
