package com.vegarecords.tracker;

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
public interface TrackerRepository extends JpaRepository<Tracker, UUID> {

    Optional<Tracker> findByIdAndUser(UUID id, User user);
    List<Tracker> findByUser(User user);


    @Query("SELECT t FROM Tracker t WHERE t.user = :user " +
           "AND (:typeId IS NULL OR t.trackerType.id = :typeId) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (CAST(:search AS string) IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(t.notes) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Tracker> findAllWithFilters(
            @Param("user") User user,
            @Param("typeId") UUID typeId,
            @Param("status") String status,
            @Param("search") String search,
            Pageable pageable
    );
}
