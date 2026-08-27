package com.vegarecords.tracker;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackerRequest {

    private UUID trackerTypeId;

    @NotBlank(message = "Title is required")
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
    private List<UUID> categoryIds;
}
