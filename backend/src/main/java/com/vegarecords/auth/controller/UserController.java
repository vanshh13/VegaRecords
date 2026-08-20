package com.vegarecords.auth.controller;

import com.vegarecords.auth.dto.*;
import com.vegarecords.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {
        UserResponse updatedUser = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        ApiResponse response = userService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}
