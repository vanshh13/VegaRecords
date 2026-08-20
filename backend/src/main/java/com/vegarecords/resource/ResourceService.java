package com.vegarecords.resource;

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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ResourceResponse createResource(String userEmail, ResourceRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<Category> categories = new HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
        }

        Resource resource = Resource.builder()
                .user(user)
                .title(request.getTitle())
                .url(request.getUrl())
                .resourceType(request.getResourceType() != null ? request.getResourceType() : ResourceType.LINK)
                .notes(request.getNotes())
                .isFavorite(request.getIsFavorite() != null ? request.getIsFavorite() : false)
                .categories(categories)
                .build();

        Resource saved = resourceRepository.save(resource);
        return toResourceResponse(saved);
    }

    public Page<ResourceResponse> getResources(
            String userEmail,
            ResourceType type,
            UUID categoryId,
            String search,
            int page,
            int size
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Resource> resourcePage = resourceRepository.findAllWithFilters(
                user,
                type,
                categoryId,
                (search != null && !search.isBlank()) ? search.trim() : null,
                pageable
        );

        return resourcePage.map(this::toResourceResponse);
    }

    public ResourceResponse getResourceById(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resource resource = resourceRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        return toResourceResponse(resource);
    }

    @Transactional
    public ResourceResponse updateResource(String userEmail, UUID id, ResourceRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resource resource = resourceRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setTitle(request.getTitle());
        resource.setUrl(request.getUrl());
        if (request.getResourceType() != null) {
            resource.setResourceType(request.getResourceType());
        }
        resource.setNotes(request.getNotes());
        if (request.getIsFavorite() != null) {
            resource.setIsFavorite(request.getIsFavorite());
        }

        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            resource.setCategories(categories);
        }

        Resource updated = resourceRepository.save(resource);
        return toResourceResponse(updated);
    }

    @Transactional
    public void deleteResource(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resource resource = resourceRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resourceRepository.delete(resource);
    }

    public List<ResourceResponse> getFavoriteResources(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return resourceRepository.findByUserAndIsFavoriteTrue(user).stream()
                .map(this::toResourceResponse)
                .collect(Collectors.toList());
    }

    private ResourceResponse toResourceResponse(Resource resource) {
        List<CategoryResponse> categoryResponses = resource.getCategories() != null
                ? resource.getCategories().stream().map(this::toCategoryResponse).collect(Collectors.toList())
                : List.of();

        return ResourceResponse.builder()
                .id(resource.getId())
                .title(resource.getTitle())
                .url(resource.getUrl())
                .resourceType(resource.getResourceType())
                .notes(resource.getNotes())
                .isFavorite(resource.getIsFavorite())
                .categories(categoryResponses)
                .createdAt(resource.getCreatedAt())
                .build();
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
}
