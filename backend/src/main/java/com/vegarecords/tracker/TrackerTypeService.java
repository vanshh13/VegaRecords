package com.vegarecords.tracker;

import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.ResourceNotFoundException;
import com.vegarecords.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackerTypeService {

    private final TrackerTypeRepository trackerTypeRepository;
    private final TrackerTypeFieldRepository trackerTypeFieldRepository;
    private final UserRepository userRepository;

    @Transactional
    public TrackerTypeResponse createTrackerType(String userEmail, TrackerTypeRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrackerType trackerType = TrackerType.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .isSystem(false)
                .build();

        if (request.getFields() != null) {
            List<TrackerTypeField> fields = request.getFields().stream()
                    .map(f -> TrackerTypeField.builder()
                            .trackerType(trackerType)
                            .fieldName(f.getFieldName())
                            .fieldType(f.getFieldType())
                            .isRequired(f.getIsRequired() != null ? f.getIsRequired() : false)
                            .displayOrder(f.getDisplayOrder() != null ? f.getDisplayOrder() : 0)
                            .options(f.getOptions())
                            .build())
                    .collect(Collectors.toList());
            trackerType.setFields(fields);
        }

        TrackerType saved = trackerTypeRepository.save(trackerType);
        return toTrackerTypeResponse(saved);
    }

    @Transactional
    public TrackerTypeResponse addFieldToType(String userEmail, UUID typeId, TrackerTypeFieldRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrackerType trackerType = trackerTypeRepository.findByIdAndUserOrIsSystemTrue(typeId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker type not found"));

        TrackerTypeField field = TrackerTypeField.builder()
                .trackerType(trackerType)
                .fieldName(request.getFieldName())
                .fieldType(request.getFieldType())
                .isRequired(request.getIsRequired() != null ? request.getIsRequired() : false)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .options(request.getOptions())
                .build();


        trackerTypeFieldRepository.save(field);
        return toTrackerTypeResponse(trackerType);
    }

    public List<TrackerTypeResponse> getAllTrackerTypes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return trackerTypeRepository.findByUserOrIsSystemTrue(user).stream()
                .map(this::toTrackerTypeResponse)
                .collect(Collectors.toList());
    }

    public TrackerTypeResponse getTrackerTypeById(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrackerType trackerType = trackerTypeRepository.findByIdAndUserOrIsSystemTrue(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker type not found"));

        return toTrackerTypeResponse(trackerType);
    }

    private boolean checkIsAdmin(User user) {
        if (user == null || user.getRole() == null) return false;
        String roleName = user.getRole().getRoleName();
        return "ADMIN".equalsIgnoreCase(roleName) || "ROLE_ADMIN".equalsIgnoreCase(roleName);
    }

    @Transactional
    public TrackerTypeResponse updateTrackerType(String userEmail, UUID id, TrackerTypeRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrackerType trackerType = trackerTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker type not found"));

        boolean isAdmin = checkIsAdmin(user);
        boolean isOwner = trackerType.getUser() != null && trackerType.getUser().getId().equals(user.getId());

        if (Boolean.TRUE.equals(trackerType.getIsSystem()) && !isAdmin) {
            throw new com.vegarecords.auth.exception.BadRequestException("Only system administrators can modify global system tracker types.");
        }
        if (!Boolean.TRUE.equals(trackerType.getIsSystem()) && !isOwner && !isAdmin) {
            throw new ResourceNotFoundException("Tracker type not found or access denied.");
        }

        trackerType.setName(request.getName());
        trackerType.setDescription(request.getDescription());

        TrackerType updated = trackerTypeRepository.save(trackerType);
        return toTrackerTypeResponse(updated);
    }

    @Transactional
    public void deleteTrackerType(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrackerType trackerType = trackerTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tracker type not found"));

        boolean isAdmin = checkIsAdmin(user);
        boolean isOwner = trackerType.getUser() != null && trackerType.getUser().getId().equals(user.getId());

        if (Boolean.TRUE.equals(trackerType.getIsSystem()) && !isAdmin) {
            throw new com.vegarecords.auth.exception.BadRequestException("Only system administrators can delete global system tracker types.");
        }
        if (!Boolean.TRUE.equals(trackerType.getIsSystem()) && !isOwner && !isAdmin) {
            throw new ResourceNotFoundException("Tracker type not found or access denied.");
        }

        trackerTypeRepository.delete(trackerType);
    }

    private TrackerTypeResponse toTrackerTypeResponse(TrackerType trackerType) {
        List<TrackerTypeFieldResponse> fields = trackerType.getFields() != null
                ? trackerType.getFields().stream()
                .map(f -> TrackerTypeFieldResponse.builder()
                        .id(f.getId())
                        .fieldName(f.getFieldName())
                        .fieldType(f.getFieldType())
                        .isRequired(f.getIsRequired())
                        .displayOrder(f.getDisplayOrder())
                        .options(f.getOptions())
                        .build())
                .collect(Collectors.toList())
                : new ArrayList<>();


        return TrackerTypeResponse.builder()
                .id(trackerType.getId())
                .name(trackerType.getName())
                .description(trackerType.getDescription())
                .isSystem(trackerType.getIsSystem())
                .fields(fields)
                .createdAt(trackerType.getCreatedAt())
                .build();
    }
}
