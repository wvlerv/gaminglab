package com.gaminglab.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;


    @PostMapping("/signup")
    public ResponseEntity<Dtos.AuthResponse> signup(@Valid @RequestBody Dtos.SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.signup(request));
    }

    @PostMapping("/login")
    public Dtos.AuthResponse login(@Valid @RequestBody Dtos.LoginRequest request) {
        return service.login(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }
}
