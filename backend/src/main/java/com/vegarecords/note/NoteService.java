package com.vegarecords.note;

import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.ResourceNotFoundException;
import com.vegarecords.auth.repository.UserRepository;
import com.vegarecords.category.Category;
import com.vegarecords.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public NoteResponse createNote(String userEmail, NoteRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        Note note = Note.builder()
                .user(user)
                .category(category)
                .trackerId(request.getTrackerId())
                .title(request.getTitle())
                .content(request.getContent())
                .isFavorite(request.getIsFavorite() != null ? request.getIsFavorite() : false)
                .build();

        Note saved = noteRepository.save(note);
        return toNoteResponse(saved);
    }

    public Page<NoteResponse> getNotes(
            String userEmail,
            UUID categoryId,
            UUID trackerId,
            Boolean isFavorite,
            String search,
            int page,
            int size
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        Page<Note> notePage = noteRepository.findAllWithFilters(
                user,
                categoryId,
                trackerId,
                isFavorite,
                (search != null && !search.isBlank()) ? search.trim() : null,
                pageable
        );

        return notePage.map(this::toNoteResponse);
    }

    public NoteResponse getNoteById(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Note note = noteRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));

        return toNoteResponse(note);
    }

    @Transactional
    public NoteResponse updateNote(String userEmail, UUID id, NoteRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Note note = noteRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            note.setCategory(category);
        } else {
            note.setCategory(null);
        }

        note.setTrackerId(request.getTrackerId());
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        if (request.getIsFavorite() != null) {
            note.setIsFavorite(request.getIsFavorite());
        }

        Note updated = noteRepository.save(note);
        return toNoteResponse(updated);
    }

    @Transactional
    public void deleteNote(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Note note = noteRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));

        noteRepository.delete(note);
    }

    private NoteResponse toNoteResponse(Note note) {
        return NoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .categoryId(note.getCategory() != null ? note.getCategory().getId() : null)
                .categoryName(note.getCategory() != null ? note.getCategory().getName() : null)
                .trackerId(note.getTrackerId())
                .isFavorite(note.getIsFavorite())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}
