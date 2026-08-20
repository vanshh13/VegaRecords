package com.vegarecords.tracker;

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
    private List<TrackerValueResponse> values;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
