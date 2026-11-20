package com.gaminglab.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public Dtos.ProfileResponse getProfile() {
        return toProfile(currentUser.getRequiredUser());
    }

    @Transactional
    public Dtos.ProfileResponse updateProfile(Dtos.ProfileRequest request) {
        UserAccount user = currentUser.getRequiredUser();
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setPhone(request.phone() == null ? null : request.phone().trim());
        return toProfile(users.save(user));
    }

    @Transactional
    public Dtos.ProfileResponse updateDeliveryPreferences(Dtos.DeliveryPreferencesRequest request) {
        UserAccount user = currentUser.getRequiredUser();
        user.setPreferredCarrier(request.carrier());
        user.setPreferredCity(request.city() == null ? null : request.city().trim());
        user.setPreferredDeliveryMethod(request.deliveryMethod());
        user.setPreferredDeliveryPoint(request.deliveryPoint() == null ? null : request.deliveryPoint().trim());
        return toProfile(users.save(user));
    }

    @Transactional
    public void changePassword(Dtos.ChangePasswordRequest request) {
        UserAccount user = currentUser.getRequiredUser();
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be different");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        users.save(user);
    }


    private Dtos.ProfileResponse toProfile(UserAccount user) {
        return new Dtos.ProfileResponse(
            user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getPhone(),
            user.getPreferredCarrier(), user.getPreferredCity(),
            user.getPreferredDeliveryMethod(), user.getPreferredDeliveryPoint());
    }
}
