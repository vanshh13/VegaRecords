package com.vegarecords.activity;

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
public class ActivityLogResponse {

    private UUID id;
    private String entityType;
    private UUID entityId;
    private String action;
    private String metadata;
    private LocalDateTime createdAt;
}
