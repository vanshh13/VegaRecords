package com.vegarecords.tracker;

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
public class TrackerValueResponse {

    private UUID id;
    private UUID fieldId;
    private String fieldName;
    private String fieldType;
    private String value;
    private LocalDateTime createdAt;
}
