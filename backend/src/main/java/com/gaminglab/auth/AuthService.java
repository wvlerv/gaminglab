package com.gaminglab.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwt;


    public Dtos.AuthResponse signup(Dtos.SignupRequest request) {
        if (!request.acceptedTerms()) throw new AuthException("You must accept the Terms of Use and Privacy Policy.");
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) throw new AuthException("An account with this email already exists.");

        UserAccount user = users.save(new UserAccount(
            request.firstName().trim(), request.lastName().trim(), email,
            passwordEncoder.encode(request.password())));
        return response(user);
    }

    public Dtos.AuthResponse login(Dtos.LoginRequest request) {
        UserAccount user = users.findByEmailIgnoreCase(request.email().trim().toLowerCase())
            .orElseThrow(() -> new AuthException("Invalid email or password."));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AuthException("Invalid email or password.");
        }
        return response(user);
    }

    private Dtos.AuthResponse response(UserAccount user) {
        Dtos.UserResponse userResponse = new Dtos.UserResponse(
            user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
        return new Dtos.AuthResponse(jwt.generateToken(user), "Bearer", userResponse);
    }
}
