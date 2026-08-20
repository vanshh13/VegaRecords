package com.vegarecords.tracker;

import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.ResourceNotFoundException;
import com.vegarecords.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackerService {

    private final TrackerRepository trackerRepository;
    private final TrackerTypeRepository trackerTypeRepository;
    private final TrackerTypeFieldRepository trackerTypeFieldRepository;
    private final TrackerValueRepository trackerValueRepository;
    private final UserRepository userRepository;

    @Transactional
    public TrackerResponse createTracker(String userEmail, TrackerRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrackerType trackerType = trackerTypeRepository.findByIdAndUserOrIsSystemTrue(request.getTrackerTypeId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker type not found"));

        Tracker tracker = Tracker.builder()
                .user(user)
                .trackerType(trackerType)
                .title(request.getTitle())
                .notes(request.getNotes())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();

        Tracker saved = trackerRepository.save(tracker);
        return toTrackerResponse(saved);
    }

    public Page<TrackerResponse> getTrackers(
            String userEmail,
            UUID trackerTypeId,
            String status,
            String search,
            int page,
            int size
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Tracker> trackerPage = trackerRepository.findAllWithFilters(
                user,
                trackerTypeId,
                status,
                (search != null && !search.isBlank()) ? search.trim() : null,
                pageable
        );

        return trackerPage.map(this::toTrackerResponse);
    }

    public TrackerResponse getTrackerById(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Tracker tracker = trackerRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker not found with id: " + id));

        return toTrackerResponse(tracker);
    }

    @Transactional
    public TrackerResponse updateTracker(String userEmail, UUID id, TrackerRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Tracker tracker = trackerRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker not found with id: " + id));

        tracker.setTitle(request.getTitle());
        tracker.setNotes(request.getNotes());
        if (request.getStatus() != null) {
            tracker.setStatus(request.getStatus());
        }

        Tracker updated = trackerRepository.save(tracker);
        return toTrackerResponse(updated);
    }

    @Transactional
    public TrackerResponse updateTrackerStatus(String userEmail, UUID id, TrackerStatusRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Tracker tracker = trackerRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker not found with id: " + id));

        tracker.setStatus(request.getStatus());
        Tracker updated = trackerRepository.save(tracker);
        return toTrackerResponse(updated);
    }

    @Transactional
    public void deleteTracker(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Tracker tracker = trackerRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker not found with id: " + id));

        trackerRepository.delete(tracker);
    }

    @Transactional
    public TrackerValueResponse saveTrackerValue(String userEmail, UUID trackerId, TrackerValueRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Tracker tracker = trackerRepository.findByIdAndUser(trackerId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker not found"));

        TrackerTypeField field = trackerTypeFieldRepository.findById(request.getFieldId())
                .orElseThrow(() -> new ResourceNotFoundException("Tracker field not found"));

        Optional<TrackerValue> existingValue = trackerValueRepository.findByTrackerIdAndTrackerFieldId(trackerId, request.getFieldId());

        TrackerValue valueToSave;
        if (existingValue.isPresent()) {
            valueToSave = existingValue.get();
            valueToSave.setValueJson(request.getValue());
        } else {
            valueToSave = TrackerValue.builder()
                    .tracker(tracker)
                    .trackerField(field)
                    .valueJson(request.getValue())
                    .build();
        }

        TrackerValue saved = trackerValueRepository.save(valueToSave);
        return toTrackerValueResponse(saved);
    }

    public List<TrackerValueResponse> getTrackerValues(String userEmail, UUID trackerId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Tracker tracker = trackerRepository.findByIdAndUser(trackerId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker not found"));

        return trackerValueRepository.findByTrackerId(tracker.getId()).stream()
                .map(this::toTrackerValueResponse)
                .collect(Collectors.toList());
    }

    private TrackerResponse toTrackerResponse(Tracker tracker) {
        List<TrackerValueResponse> values = tracker.getValues() != null
                ? tracker.getValues().stream().map(this::toTrackerValueResponse).collect(Collectors.toList())
                : new ArrayList<>();

        return TrackerResponse.builder()
                .id(tracker.getId())
                .trackerTypeId(tracker.getTrackerType() != null ? tracker.getTrackerType().getId() : null)
                .trackerTypeName(tracker.getTrackerType() != null ? tracker.getTrackerType().getName() : null)
                .title(tracker.getTitle())
                .notes(tracker.getNotes())
                .status(tracker.getStatus())
                .values(values)
                .createdAt(tracker.getCreatedAt())
                .updatedAt(tracker.getUpdatedAt())
                .build();
    }

    private TrackerValueResponse toTrackerValueResponse(TrackerValue value) {
        return TrackerValueResponse.builder()
                .id(value.getId())
                .fieldId(value.getTrackerField() != null ? value.getTrackerField().getId() : null)
                .fieldName(value.getTrackerField() != null ? value.getTrackerField().getFieldName() : null)
                .fieldType(value.getTrackerField() != null ? value.getTrackerField().getFieldType() : null)
                .value(value.getValueJson())
                .createdAt(value.getCreatedAt())
                .build();
    }
}
