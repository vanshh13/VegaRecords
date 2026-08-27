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
public class TrackerTypeFieldRequest {

    @NotBlank(message = "Field name is required")
    private String fieldName;

    @NotBlank(message = "Field type is required")
    private String fieldType;

    private Boolean isRequired;
    private Integer displayOrder;
    private String options;
}

