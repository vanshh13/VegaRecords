package com.vegarecords.tracker;

import com.vegarecords.auth.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/trackers")
@RequiredArgsConstructor
public class TrackerController {

    private final TrackerService trackerService;

    @PostMapping
    public ResponseEntity<ApiResponse<TrackerResponse>> createTracker(
            Authentication authentication,
            @Valid @RequestBody TrackerRequest request
    ) {
        TrackerResponse response = trackerService.createTracker(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tracker created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TrackerResponse>>> getTrackers(
            Authentication authentication,
            @RequestParam(required = false) UUID trackerTypeId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<TrackerResponse> trackers = trackerService.getTrackers(authentication.getName(), trackerTypeId, status, search, page, size);
        return ResponseEntity.ok(ApiResponse.success("Trackers fetched successfully", trackers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TrackerResponse>> getTrackerById(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        TrackerResponse tracker = trackerService.getTrackerById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Tracker fetched successfully", tracker));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TrackerResponse>> updateTracker(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody TrackerRequest request
    ) {
        TrackerResponse updated = trackerService.updateTracker(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Tracker updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TrackerResponse>> updateTrackerStatus(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody TrackerStatusRequest request
    ) {
        TrackerResponse updated = trackerService.updateTrackerStatus(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Tracker status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTracker(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        trackerService.deleteTracker(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Tracker deleted successfully"));
    }

    @PostMapping("/{id}/values")
    public ResponseEntity<ApiResponse<TrackerValueResponse>> saveTrackerValue(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody TrackerValueRequest request
    ) {
        TrackerValueResponse response = trackerService.saveTrackerValue(authentication.getName(), id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tracker value recorded successfully", response));
    }

    @GetMapping("/{id}/values")
    public ResponseEntity<ApiResponse<List<TrackerValueResponse>>> getTrackerValues(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        List<TrackerValueResponse> values = trackerService.getTrackerValues(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Tracker values fetched successfully", values));
    }
}
