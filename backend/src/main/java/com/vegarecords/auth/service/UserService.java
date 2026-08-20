package com.vegarecords.auth.service;

import com.vegarecords.auth.dto.*;
import com.vegarecords.auth.entity.Role;
import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.BadRequestException;
import com.vegarecords.auth.exception.ResourceNotFoundException;
import com.vegarecords.auth.mapper.UserMapper;
import com.vegarecords.auth.repository.RefreshTokenRepository;
import com.vegarecords.auth.repository.RoleRepository;
import com.vegarecords.auth.repository.UserRepository;
import com.vegarecords.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toUserResponse(updatedUser);
    }

    @Transactional
    public ApiResponse changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        refreshTokenRepository.deleteByUser(user);

        return ApiResponse.builder()
                .success(true)
                .message("Password changed successfully. Please log in again.")
                .build();
    }

    public Page<UserResponse> getAllUsers(int page, int size, String search, Boolean isActive) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String searchParam = (search != null && !search.isBlank())
                ? "%" + search.trim().toLowerCase() + "%"
                : null;
        Page<User> usersPage = userRepository.findAllWithFilters(
                searchParam,
                isActive,
                pageable
        );
        return usersPage.map(userMapper::toUserResponse);
    }

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserStatus(UUID id, UpdateUserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setIsActive(request.getIsActive());
        User updated = userRepository.save(user);

        if (Boolean.FALSE.equals(request.getIsActive())) {
            refreshTokenRepository.deleteByUser(user);
        }

        return userMapper.toUserResponse(updated);
    }

    @Transactional
    public UserResponse updateUserRole(UUID id, UpdateUserRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String targetRoleName = request.getRoleName().toUpperCase();

        // Safety check: Prevent demoting the last remaining admin
        if ("USER".equals(targetRoleName) && user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().getRoleName())) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && "ADMIN".equalsIgnoreCase(u.getRole().getRoleName()))
                    .count();
            if (adminCount <= 1) {
                throw new BadRequestException("Cannot demote the last remaining ADMIN user in the system.");
            }
        }

        Role newRole = roleRepository.findByRoleName(targetRoleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + targetRoleName));

        user.setRole(newRole);
        User updated = userRepository.save(user);
        return userMapper.toUserResponse(updated);
    }

    public AdminStatsResponse getAdminStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActive(true);
        long inactiveUsers = totalUsers - activeUsers;
        long totalSystemCategories = categoryRepository.countByIsSystemTrue();

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .totalSystemCategories(totalSystemCategories)
                .build();
    }
}
