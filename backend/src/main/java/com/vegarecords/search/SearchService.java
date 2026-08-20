package com.vegarecords.search;

import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.ResourceNotFoundException;
import com.vegarecords.auth.repository.UserRepository;
import com.vegarecords.note.NoteService;
import com.vegarecords.resource.ResourceService;
import com.vegarecords.task.TaskService;
import com.vegarecords.tracker.TrackerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final UserRepository userRepository;
    private final NoteService noteService;
    private final ResourceService resourceService;
    private final TaskService taskService;
    private final TrackerService trackerService;

    public SearchResponse globalSearch(String userEmail, String query) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (query == null || query.isBlank()) {
            return SearchResponse.builder().build();
        }

        var notes = noteService.getNotes(userEmail, null, null, null, query, 0, 10).getContent();
        var resources = resourceService.getResources(userEmail, null, null, query, 0, 10).getContent();
        var tasks = taskService.getTasks(userEmail, null, null, null, query, 0, 10).getContent();
        var trackers = trackerService.getTrackers(userEmail, null, null, query, 0, 10).getContent();

        return SearchResponse.builder()
                .notes(notes)
                .resources(resources)
                .tasks(tasks)
                .trackers(trackers)
                .build();
    }
}
