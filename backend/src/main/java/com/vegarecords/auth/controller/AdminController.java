package com.vegarecords.auth.controller;

import com.vegarecords.auth.dto.*;
import com.vegarecords.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean status
    ) {
        log.debug("[ADMIN] Fetching user list page {} size {}", page, size);
        Page<UserResponse> users = userService.getAllUsers(page, size, search, status);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        log.debug("[ADMIN] Inspecting user ID {}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User details retrieved", user));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        log.info("[ADMIN] Updating status for user ID {} to isActive={}", id, request.getIsActive());
        UserResponse updatedUser = userService.updateUserStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updatedUser));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        log.info("[ADMIN] Shift role for user ID {} -> {}", id, request.getRoleName());
        UserResponse updatedUser = userService.updateUserRole(id, request);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updatedUser));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getAdminStats() {
        log.debug("[ADMIN] Fetching administration overview metrics");
        AdminStatsResponse stats = userService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved", stats));
    }
}
