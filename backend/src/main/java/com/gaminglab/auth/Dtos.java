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
}
