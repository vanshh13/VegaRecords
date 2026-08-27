package com.vegarecords.tracker;

import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.ResourceNotFoundException;
import com.vegarecords.auth.repository.UserRepository;
import com.vegarecords.category.Category;
import com.vegarecords.category.CategoryRepository;
import com.vegarecords.category.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackerService {

    private final TrackerRepository trackerRepository;
    private final TrackerTypeRepository trackerTypeRepository;
    private final TrackerTypeFieldRepository trackerTypeFieldRepository;
    private final TrackerValueRepository trackerValueRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public TrackerResponse createTracker(String userEmail, TrackerRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getTrackerTypeId() == null) {
            throw new IllegalArgumentException("Tracker type ID is required");
        }

        TrackerType trackerType = trackerTypeRepository.findByIdAndUserOrIsSystemTrue(request.getTrackerTypeId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker type not found"));

        Set<Category> categories = new HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
        } else if (request.getCategoryId() != null) {
            categoryRepository.findById(request.getCategoryId()).ifPresent(categories::add);
        }

        Tracker tracker = Tracker.builder()
                .user(user)
                .trackerType(trackerType)
                .title(request.getTitle())
                .notes(request.getNotes())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .coverUrl(request.getCoverUrl())
                .currentCount(request.getCurrentCount() != null ? request.getCurrentCount() : 0)
                .targetCount(request.getTargetCount() != null ? request.getTargetCount() : 100)
                .unitLabel(request.getUnitLabel())
                .rating(request.getRating())
                .isOngoing(request.getIsOngoing() != null ? request.getIsOngoing() : false)
                .isFavorite(request.getIsFavorite() != null ? request.getIsFavorite() : false)
                .categories(categories)
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
        if (request.getCoverUrl() != null) {
            tracker.setCoverUrl(request.getCoverUrl());
        }
        if (request.getCurrentCount() != null) {
            tracker.setCurrentCount(request.getCurrentCount());
        }
        if (request.getTargetCount() != null) {
            tracker.setTargetCount(request.getTargetCount());
        }
        if (request.getUnitLabel() != null) {
            tracker.setUnitLabel(request.getUnitLabel());
        }
        if (request.getRating() != null) {
            tracker.setRating(request.getRating());
        }
        if (request.getIsOngoing() != null) {
            tracker.setIsOngoing(request.getIsOngoing());
        }
        if (request.getIsFavorite() != null) {
            tracker.setIsFavorite(request.getIsFavorite());
        }

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            tracker.setCategories(categories);
        } else if (request.getCategoryId() != null) {
            Set<Category> categories = new HashSet<>();
            categoryRepository.findById(request.getCategoryId()).ifPresent(categories::add);
            tracker.setCategories(categories);
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

        TrackerTypeField field = null;
        if (request.getFieldId() != null) {
            field = trackerTypeFieldRepository.findById(request.getFieldId()).orElse(null);
        } else if (tracker.getTrackerType() != null && tracker.getTrackerType().getFields() != null && !tracker.getTrackerType().getFields().isEmpty()) {
            field = tracker.getTrackerType().getFields().get(0);
        }

        Optional<TrackerValue> existingValue = (field != null)
                ? trackerValueRepository.findByTrackerIdAndTrackerFieldId(trackerId, field.getId())
                : Optional.empty();

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

        List<UUID> categoryIds = tracker.getCategories() != null
                ? tracker.getCategories().stream().map(Category::getId).collect(Collectors.toList())
                : new ArrayList<>();

        List<CategoryResponse> categoryResponses = tracker.getCategories() != null
                ? tracker.getCategories().stream().map(this::toCategoryResponse).collect(Collectors.toList())
                : new ArrayList<>();

        Category firstCat = (tracker.getCategories() != null && !tracker.getCategories().isEmpty())
                ? tracker.getCategories().iterator().next()
                : null;

        return TrackerResponse.builder()
                .id(tracker.getId())
                .trackerTypeId(tracker.getTrackerType() != null ? tracker.getTrackerType().getId() : null)
                .trackerTypeName(tracker.getTrackerType() != null ? tracker.getTrackerType().getName() : null)
                .title(tracker.getTitle())
                .notes(tracker.getNotes())
                .status(tracker.getStatus())
                .coverUrl(tracker.getCoverUrl())
                .currentCount(tracker.getCurrentCount())
                .targetCount(tracker.getTargetCount())
                .unitLabel(tracker.getUnitLabel())
                .rating(tracker.getRating())
                .isOngoing(tracker.getIsOngoing() != null ? tracker.getIsOngoing() : false)
                .isFavorite(tracker.getIsFavorite() != null ? tracker.getIsFavorite() : false)
                .categoryId(firstCat != null ? firstCat.getId() : null)
                .categoryName(firstCat != null ? firstCat.getName() : null)
                .categoryIds(categoryIds)
                .categories(categoryResponses)
                .values(values)
                .createdAt(tracker.getCreatedAt())
                .updatedAt(tracker.getUpdatedAt())
                .build();
    }

    private CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .parentCategoryId(category.getParentCategory() != null ? category.getParentCategory().getId() : null)
                .parentCategoryName(category.getParentCategory() != null ? category.getParentCategory().getName() : null)
                .description(category.getDescription())
                .icon(category.getIcon())
                .color(category.getColor())
                .isSystem(category.getIsSystem())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
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
