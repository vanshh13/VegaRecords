package com.vegarecords.tracker;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackerValueRequest {

    @NotNull(message = "Field ID is required")
    private UUID fieldId;

    private String value;
}
