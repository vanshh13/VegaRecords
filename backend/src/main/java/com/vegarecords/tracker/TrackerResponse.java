package com.vegarecords.tracker;

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
public class TrackerResponse {

    private UUID id;
    private UUID trackerTypeId;
    private String trackerTypeName;
    private String title;
    private String notes;
    private String status;
    private String coverUrl;
    private Integer currentCount;
    private Integer targetCount;
    private String unitLabel;
    private Double rating;
    private Boolean isOngoing;
    private Boolean isFavorite;
    private UUID categoryId;
    private String categoryName;
    private List<UUID> categoryIds;
    private List<CategoryResponse> categories;
    private List<TrackerValueResponse> values;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
