package com.vegarecords.auth.dto;

import com.vegarecords.auth.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private UUID id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private Gender gender;
    private String profileImageUrl;
    private String role;
    private Boolean isActive;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
