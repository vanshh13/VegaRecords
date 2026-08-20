package com.vegarecords.category;

import com.vegarecords.auth.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            Authentication authentication,
            @Valid @RequestBody CategoryRequest request
    ) {
        log.info("[CATEGORY] Creating category '{}' for user '{}'", request.getName(), authentication.getName());
        CategoryResponse response = categoryService.createCategory(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(Authentication authentication) {
        log.debug("[CATEGORY] Fetching all categories for user '{}'", authentication.getName());
        List<CategoryResponse> categories = categoryService.getAllCategories(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Categories fetched successfully", categories));
    }

    @GetMapping("/tree")
    public ResponseEntity<ApiResponse<List<CategoryTreeResponse>>> getCategoryTree(Authentication authentication) {
        log.debug("[CATEGORY] Fetching category tree hierarchy for user '{}'", authentication.getName());
        List<CategoryTreeResponse> tree = categoryService.getCategoryTree(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Category tree fetched successfully", tree));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        log.debug("[CATEGORY] Fetching category ID {} for user '{}'", id, authentication.getName());
        CategoryResponse category = categoryService.getCategoryById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Category fetched successfully", category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody CategoryRequest request
    ) {
        log.info("[CATEGORY] Updating category ID {} to '{}'", id, request.getName());
        CategoryResponse updated = categoryService.updateCategory(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        log.info("[CATEGORY] Deleting category ID {} for user '{}'", id, authentication.getName());
        categoryService.deleteCategory(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully"));
    }
}
