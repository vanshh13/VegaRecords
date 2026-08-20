package com.vegarecords.resource;

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
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(
            Authentication authentication,
            @Valid @RequestBody ResourceRequest request
    ) {
        ResourceResponse response = resourceService.createResource(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ResourceResponse>>> getResources(
            Authentication authentication,
            @RequestParam(required = false) ResourceType resourceType,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ResourceResponse> resources = resourceService.getResources(authentication.getName(), resourceType, categoryId, search, page, size);
        return ResponseEntity.ok(ApiResponse.success("Resources retrieved successfully", resources));
    }

    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getFavorites(Authentication authentication) {
        List<ResourceResponse> favorites = resourceService.getFavoriteResources(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Favorite resources retrieved successfully", favorites));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> getResourceById(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        ResourceResponse resource = resourceService.getResourceById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Resource details retrieved", resource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody ResourceRequest request
    ) {
        ResourceResponse updated = resourceService.updateResource(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResource(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        resourceService.deleteResource(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully"));
    }
}
