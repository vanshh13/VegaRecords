package com.vegarecords.category;

import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.BadRequestException;
import com.vegarecords.auth.exception.ResourceNotFoundException;
import com.vegarecords.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private boolean checkIsAdmin(User user) {
        if (user == null || user.getRole() == null) return false;
        String roleName = user.getRole().getRoleName();
        return "ADMIN".equalsIgnoreCase(roleName) || "ROLE_ADMIN".equalsIgnoreCase(roleName);
    }

    @Transactional
    public CategoryResponse createCategory(String userEmail, CategoryRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category parentCategory = null;
        if (request.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
        }

        boolean isAdmin = checkIsAdmin(user);
        boolean isSystemCategory = isAdmin && Boolean.TRUE.equals(request.getIsSystem());

        Category category = Category.builder()
                .user(user)
                .name(request.getName())
                .parentCategory(parentCategory)
                .description(request.getDescription())
                .icon(request.getIcon())
                .color(request.getColor())
                .isSystem(isSystemCategory)
                .build();

        Category saved = categoryRepository.save(category);
        return toCategoryResponse(saved);
    }

    public List<CategoryResponse> getAllCategories(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Returns all global system categories (isSystem = true) + personal custom categories belonging to this user
        return categoryRepository.findByUserOrIsSystemTrue(user).stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryTreeResponse> getCategoryTree(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Category> rootCategories = categoryRepository.findRootCategories(user);
        return rootCategories.stream()
                .map(this::toCategoryTreeResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findByIdAndUserOrIsSystemTrue(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return toCategoryResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(String userEmail, UUID id, CategoryRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        boolean isAdmin = checkIsAdmin(user);
        boolean isOwner = category.getUser() != null && category.getUser().getId().equals(user.getId());

        // Security check: Only admins can edit system categories; non-admins can only edit their own custom categories
        if (Boolean.TRUE.equals(category.getIsSystem()) && !isAdmin) {
            throw new BadRequestException("Only system administrators can modify global system categories.");
        }
        if (!Boolean.TRUE.equals(category.getIsSystem()) && !isOwner && !isAdmin) {
            throw new ResourceNotFoundException("Category not found or access denied.");
        }

        Category parentCategory = null;
        if (request.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
        }

        category.setName(request.getName());
        category.setParentCategory(parentCategory);
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());

        if (isAdmin && request.getIsSystem() != null) {
            category.setIsSystem(request.getIsSystem());
        }

        Category updated = categoryRepository.save(category);
        return toCategoryResponse(updated);
    }

    @Transactional
    public void deleteCategory(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        boolean isAdmin = checkIsAdmin(user);
        boolean isOwner = category.getUser() != null && category.getUser().getId().equals(user.getId());

        if (Boolean.TRUE.equals(category.getIsSystem()) && !isAdmin) {
            throw new BadRequestException("Only system administrators can delete global system categories.");
        }
        if (!Boolean.TRUE.equals(category.getIsSystem()) && !isOwner && !isAdmin) {
            throw new ResourceNotFoundException("Category not found or access denied.");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse toCategoryResponse(Category category) {
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

    private CategoryTreeResponse toCategoryTreeResponse(Category category) {
        List<CategoryTreeResponse> children = category.getSubCategories() != null
                ? category.getSubCategories().stream().map(this::toCategoryTreeResponse).collect(Collectors.toList())
                : List.of();

        return CategoryTreeResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .icon(category.getIcon())
                .color(category.getColor())
                .isSystem(category.getIsSystem())
                .children(children)
                .build();
    }
}
