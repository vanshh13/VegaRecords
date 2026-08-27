package com.vegarecords.knowledgegraph;

import com.vegarecords.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "knowledge_links", indexes = {
        @Index(name = "idx_knowledge_links_user", columnList = "user_id"),
        @Index(name = "idx_knowledge_links_source", columnList = "source_type, source_id"),
        @Index(name = "idx_knowledge_links_target", columnList = "target_type, target_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeLink {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType;

    @Column(name = "source_id", nullable = false)
    private UUID sourceId;

    @Column(name = "target_type", nullable = false, length = 50)
    private String targetType;

    @Column(name = "target_id", nullable = false)
    private UUID targetId;

    @Builder.Default
    @Column(name = "relation_type", nullable = false, length = 50)
    private String relationType = "RELATED_TO";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (relationType == null) {
            relationType = "RELATED_TO";
        }
    }
}
