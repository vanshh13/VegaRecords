package com.vegarecords.resource;

import com.vegarecords.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, UUID> {

    Optional<Resource> findByIdAndUser(UUID id, User user);

    @Query("SELECT DISTINCT r FROM Resource r LEFT JOIN r.categories c WHERE r.user = :user " +
           "AND (:type IS NULL OR r.resourceType = :type) " +
           "AND (:categoryId IS NULL OR c.id = :categoryId) " +
           "AND (CAST(:search AS string) IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(r.notes) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(r.url) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Resource> findAllWithFilters(
            @Param("user") User user,
            @Param("type") ResourceType type,
            @Param("categoryId") UUID categoryId,
            @Param("search") String search,
            Pageable pageable
    );

    List<Resource> findByUserAndIsFavoriteTrue(User user);
}
