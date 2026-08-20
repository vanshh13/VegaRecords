package com.vegarecords.tracker;

import com.vegarecords.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrackerTypeRepository extends JpaRepository<TrackerType, UUID> {
    List<TrackerType> findByUserOrIsSystemTrue(User user);
    Optional<TrackerType> findByIdAndUserOrIsSystemTrue(UUID id, User user);
}
