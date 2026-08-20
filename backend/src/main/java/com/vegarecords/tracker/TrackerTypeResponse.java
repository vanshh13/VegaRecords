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
public class TrackerTypeResponse {

    private UUID id;
    private String name;
    private String description;
    private Boolean isSystem;
    private List<TrackerTypeFieldResponse> fields;
    private LocalDateTime createdAt;
}
