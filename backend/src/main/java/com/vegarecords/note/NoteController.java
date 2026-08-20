package com.vegarecords.note;

import com.vegarecords.auth.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<ApiResponse<NoteResponse>> createNote(
            Authentication authentication,
            @Valid @RequestBody NoteRequest request
    ) {
        NoteResponse response = noteService.createNote(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Note created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NoteResponse>>> getNotes(
            Authentication authentication,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID trackerId,
            @RequestParam(required = false) Boolean isFavorite,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<NoteResponse> notes = noteService.getNotes(authentication.getName(), categoryId, trackerId, isFavorite, search, page, size);
        return ResponseEntity.ok(ApiResponse.success("Notes retrieved successfully", notes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> getNoteById(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        NoteResponse note = noteService.getNoteById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Note details retrieved", note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> updateNote(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody NoteRequest request
    ) {
        NoteResponse updated = noteService.updateNote(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Note updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        noteService.deleteNote(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Note deleted successfully"));
    }
}
