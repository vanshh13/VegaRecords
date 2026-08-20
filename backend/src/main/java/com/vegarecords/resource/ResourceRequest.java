package com.vegarecords.resource;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "URL is required")
    private String url;

    private ResourceType resourceType;
    private String notes;
    private Boolean isFavorite;
    private Set<UUID> categoryIds;
}
