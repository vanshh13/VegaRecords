package com.vegarecords.search;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResponse> globalSearch(
            Authentication authentication,
            @RequestParam("q") String query
    ) {
        SearchResponse response = searchService.globalSearch(authentication.getName(), query);
        return ResponseEntity.ok(response);
    }
}
