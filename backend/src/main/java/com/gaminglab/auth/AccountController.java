package com.gaminglab.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AccountController {
    private final AccountService service;

    @GetMapping("/profile")
    public Dtos.ProfileResponse getProfile() {
        return service.getProfile();
    }

    @PutMapping("/profile")
    public Dtos.ProfileResponse updateProfile(@Valid @RequestBody Dtos.ProfileRequest request) {
        return service.updateProfile(request);
    }

    @PutMapping("/delivery-preferences")
    public Dtos.ProfileResponse updateDeliveryPreferences(@Valid @RequestBody Dtos.DeliveryPreferencesRequest request) {
        return service.updateDeliveryPreferences(request);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody Dtos.ChangePasswordRequest request) {
        service.changePassword(request);
        return ResponseEntity.noContent().build();
    }
}
