package com.vegarecords.category;

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
public class CategoryResponse {

    private UUID id;
    private String name;
    private UUID parentCategoryId;
    private String parentCategoryName;
    private String description;
    private String icon;
    private String color;
    private Boolean isSystem;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
