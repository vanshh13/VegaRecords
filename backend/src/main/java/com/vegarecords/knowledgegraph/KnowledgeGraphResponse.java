package com.vegarecords.knowledgegraph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Full graph payload returned from GET /knowledge-links/graph.
 * Contains pre-resolved nodes and edges for direct React Flow consumption.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeGraphResponse {

    private List<GraphNode> nodes;
    private List<GraphEdge> edges;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GraphNode {
        private String id;          // UUID as string
        private String entityType;  // TASK, NOTE, RESOURCE, TRACKER, CATEGORY
        private String label;       // Resolved title/name
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GraphEdge {
        private String id;          // Link UUID as string
        private String source;      // Source node id
        private String target;      // Target node id
        private String relationType;
    }
}
