package com.vegarecords.tracker;

import com.vegarecords.auth.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tracker-types")
@RequiredArgsConstructor
public class TrackerTypeController {

    private final TrackerTypeService trackerTypeService;

    @PostMapping
    public ResponseEntity<ApiResponse<TrackerTypeResponse>> createTrackerType(
            Authentication authentication,
            @Valid @RequestBody TrackerTypeRequest request
    ) {
        TrackerTypeResponse response = trackerTypeService.createTrackerType(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tracker type created successfully", response));
    }

    @PostMapping("/{id}/fields")
    public ResponseEntity<ApiResponse<TrackerTypeResponse>> addFieldToType(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody TrackerTypeFieldRequest request
    ) {
        TrackerTypeResponse response = trackerTypeService.addFieldToType(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Field added to tracker type successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TrackerTypeResponse>>> getAllTrackerTypes(Authentication authentication) {
        List<TrackerTypeResponse> types = trackerTypeService.getAllTrackerTypes(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Tracker types fetched successfully", types));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TrackerTypeResponse>> getTrackerTypeById(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        TrackerTypeResponse response = trackerTypeService.getTrackerTypeById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Tracker type fetched successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TrackerTypeResponse>> updateTrackerType(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody TrackerTypeRequest request
    ) {
        TrackerTypeResponse updated = trackerTypeService.updateTrackerType(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Tracker type updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTrackerType(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        trackerTypeService.deleteTrackerType(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Tracker type deleted successfully"));
    }
}
