package com.vegarecords.auth.dto;

import com.vegarecords.auth.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private String firstName;
    private String lastName;
    private Gender gender;
    private String profileImageUrl;
}
