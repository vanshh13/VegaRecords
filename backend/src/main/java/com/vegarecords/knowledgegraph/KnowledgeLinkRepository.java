package com.vegarecords.knowledgegraph;

import com.vegarecords.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface KnowledgeLinkRepository extends JpaRepository<KnowledgeLink, UUID> {

    @Query("SELECT kl FROM KnowledgeLink kl WHERE kl.user = :user AND " +
            "((kl.sourceType = :entityType AND kl.sourceId = :entityId) OR " +
            "(kl.targetType = :entityType AND kl.targetId = :entityId))")
    List<KnowledgeLink> findByUserAndEntity(
            @Param("user") User user,
            @Param("entityType") String entityType,
            @Param("entityId") UUID entityId
    );

    List<KnowledgeLink> findByUser(User user);

    boolean existsByUserAndSourceTypeAndSourceIdAndTargetTypeAndTargetId(
            User user, String sourceType, UUID sourceId, String targetType, UUID targetId
    );
}
