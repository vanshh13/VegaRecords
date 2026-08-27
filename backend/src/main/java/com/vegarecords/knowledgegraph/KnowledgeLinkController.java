package com.vegarecords.knowledgegraph;

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
@RequestMapping("/api/v1/knowledge-links")
@RequiredArgsConstructor
public class KnowledgeLinkController {

    private final KnowledgeLinkService knowledgeLinkService;

    @PostMapping
    public ResponseEntity<ApiResponse<KnowledgeLinkResponse>> createLink(
            Authentication authentication,
            @Valid @RequestBody KnowledgeLinkRequest request
    ) {
        KnowledgeLinkResponse response = knowledgeLinkService.createLink(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Knowledge link created successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLink(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        knowledgeLinkService.deleteLink(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Knowledge link deleted successfully"));
    }

    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<ApiResponse<List<KnowledgeLinkResponse>>> getLinksForEntity(
            Authentication authentication,
            @PathVariable String type,
            @PathVariable UUID id
    ) {
        List<KnowledgeLinkResponse> links = knowledgeLinkService.getLinksForEntity(authentication.getName(), type, id);
        return ResponseEntity.ok(ApiResponse.success("Links retrieved successfully", links));
    }

    @GetMapping("/graph")
    public ResponseEntity<ApiResponse<KnowledgeGraphResponse>> getFullGraph(
            Authentication authentication
    ) {
        KnowledgeGraphResponse graph = knowledgeLinkService.getFullGraph(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Knowledge graph retrieved successfully", graph));
    }
}
