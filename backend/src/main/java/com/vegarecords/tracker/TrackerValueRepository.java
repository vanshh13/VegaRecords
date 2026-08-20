package com.vegarecords.tracker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrackerValueRepository extends JpaRepository<TrackerValue, UUID> {
    List<TrackerValue> findByTrackerId(UUID trackerId);
    Optional<TrackerValue> findByTrackerIdAndTrackerFieldId(UUID trackerId, UUID trackerFieldId);
}
