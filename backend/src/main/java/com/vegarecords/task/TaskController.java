package com.vegarecords.task;

import com.vegarecords.auth.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            Authentication authentication,
            @Valid @RequestBody TaskRequest request
    ) {
        log.info("[TASK] Creating task '{}' for user '{}'", request.getTitle(), authentication.getName());
        TaskResponse response = taskService.createTask(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getTasks(
            Authentication authentication,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.debug("[TASK] Fetching task page for user '{}'", authentication.getName());
        Page<TaskResponse> tasks = taskService.getTasks(authentication.getName(), status, priority, categoryId, search, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskResponse>> getUpcomingTasks(Authentication authentication) {
        log.debug("[TASK] Fetching upcoming deadlines for user '{}'", authentication.getName());
        List<TaskResponse> upcoming = taskService.getUpcomingTasks(authentication.getName());
        return ResponseEntity.ok(upcoming);
    }

    @GetMapping("/stats")
    public ResponseEntity<TaskStatsResponse> getTaskStats(Authentication authentication) {
        log.debug("[TASK] Computing task stats for user '{}'", authentication.getName());
        TaskStatsResponse stats = taskService.getTaskStats(authentication.getName());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        log.debug("[TASK] Fetching task ID {} for user '{}'", id, authentication.getName());
        TaskResponse task = taskService.getTaskById(authentication.getName(), id);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody TaskRequest request
    ) {
        log.info("[TASK] Updating task ID {} -> '{}'", id, request.getTitle());
        TaskResponse updated = taskService.updateTask(authentication.getName(), id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody TaskStatusRequest request
    ) {
        log.info("[TASK] Shift task ID {} status -> {}", id, request.getStatus());
        TaskResponse updated = taskService.updateTaskStatus(authentication.getName(), id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteTask(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        log.info("[TASK] Deleting task ID {} for user '{}'", id, authentication.getName());
        taskService.deleteTask(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Task deleted successfully").build());
    }
}
