package com.vegarecords.tracker;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackerTypeFieldResponse {

    private UUID id;
    private String fieldName;
    private String fieldType;
    private Boolean isRequired;
    private Integer displayOrder;
}
