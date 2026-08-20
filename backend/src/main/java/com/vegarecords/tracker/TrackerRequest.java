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

    @NotNull(message = "Tracker type ID is required")
    private UUID trackerTypeId;

    @NotBlank(message = "Title is required")
    private String title;

    private String notes;
    private String status;
    private List<UUID> categoryIds;
}
