package com.vegarecords.tracker;

import com.vegarecords.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrackerTypeRepository extends JpaRepository<TrackerType, UUID> {

    @Query("SELECT t FROM TrackerType t WHERE (t.user = :user OR t.isSystem = true)")
    List<TrackerType> findByUserOrIsSystemTrue(@Param("user") User user);

    @Query("SELECT t FROM TrackerType t WHERE t.id = :id AND (t.user = :user OR t.isSystem = true)")
    Optional<TrackerType> findByIdAndUserOrIsSystemTrue(@Param("id") UUID id, @Param("user") User user);
}
