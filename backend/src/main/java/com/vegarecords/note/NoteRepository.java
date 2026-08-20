package com.vegarecords.note;

import com.vegarecords.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

    Optional<Note> findByIdAndUser(UUID id, User user);

    @Query("SELECT n FROM Note n WHERE n.user = :user " +
           "AND (:categoryId IS NULL OR n.category.id = :categoryId) " +
           "AND (:trackerId IS NULL OR n.trackerId = :trackerId) " +
           "AND (:isFavorite IS NULL OR n.isFavorite = :isFavorite) " +
           "AND (CAST(:search AS string) IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Note> findAllWithFilters(
            @Param("user") User user,
            @Param("categoryId") UUID categoryId,
            @Param("trackerId") UUID trackerId,
            @Param("isFavorite") Boolean isFavorite,
            @Param("search") String search,
            Pageable pageable
    );
}
