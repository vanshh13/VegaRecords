package com.vegarecords.knowledgegraph;

import jakarta.validation.constraints.NotBlank;
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
public class KnowledgeLinkRequest {

    @NotBlank(message = "Source type is required")
    private String sourceType;

    @NotNull(message = "Source ID is required")
    private UUID sourceId;

    @NotBlank(message = "Target type is required")
    private String targetType;

    @NotNull(message = "Target ID is required")
    private UUID targetId;

    @Builder.Default
    private String relationType = "RELATED_TO";
}
