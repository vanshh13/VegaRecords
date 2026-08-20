package com.vegarecords.tracker;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackerStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;
}
