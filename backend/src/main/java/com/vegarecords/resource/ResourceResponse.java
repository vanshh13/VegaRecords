package com.vegarecords.resource;

import com.vegarecords.category.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {

    private UUID id;
    private String title;
    private String url;
    private ResourceType resourceType;
    private String notes;
    private Boolean isFavorite;
    private List<CategoryResponse> categories;
    private LocalDateTime createdAt;
}
