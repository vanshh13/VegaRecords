package com.vegarecords.knowledgegraph;

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
public class KnowledgeLinkResponse {

    private UUID id;
    private String sourceType;
    private UUID sourceId;
    private String sourceName;
    private String targetType;
    private UUID targetId;
    private String targetName;
    private String relationType;
    private LocalDateTime createdAt;
}
