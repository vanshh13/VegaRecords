package com.vegarecords.auth.mapper;

import com.vegarecords.auth.dto.UserResponse;
import com.vegarecords.auth.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .gender(user.getGender())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole() != null ? user.getRole().getRoleName() : "USER")
                .isActive(user.getIsActive())
                .isVerified(user.getIsVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
