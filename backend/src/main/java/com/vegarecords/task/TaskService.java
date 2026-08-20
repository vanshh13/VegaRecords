package com.vegarecords.task;

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

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public TaskResponse createTask(String userEmail, TaskRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        Task task = Task.builder()
                .user(user)
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .keepAfterCompletion(request.getKeepAfterCompletion() != null ? request.getKeepAfterCompletion() : true)
                .build();

        Task saved = taskRepository.save(task);
        return toTaskResponse(saved);
    }

    public Page<TaskResponse> getTasks(
            String userEmail,
            TaskStatus status,
            TaskPriority priority,
            UUID categoryId,
            String search,
            int page,
            int size
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String searchParam = (search != null && !search.isBlank())
                ? "%" + search.trim().toLowerCase() + "%"
                : null;
        Page<Task> taskPage = taskRepository.findAllWithFilters(
                user,
                status,
                priority,
                categoryId,
                searchParam,
                pageable
        );

        return taskPage.map(this::toTaskResponse);
    }

    public TaskResponse getTaskById(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        return toTaskResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(String userEmail, UUID id, TaskRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            task.setCategory(category);
        } else {
            task.setCategory(null);
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            if (request.getStatus() == TaskStatus.COMPLETED && task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            }
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());
        if (request.getKeepAfterCompletion() != null) {
            task.setKeepAfterCompletion(request.getKeepAfterCompletion());
        }

        Task updated = taskRepository.save(task);
        return toTaskResponse(updated);
    }

    @Transactional
    public TaskResponse updateTaskStatus(String userEmail, UUID id, TaskStatusRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setStatus(request.getStatus());
        if (request.getStatus() == TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        Task updated = taskRepository.save(task);
        return toTaskResponse(updated);
    }

    @Transactional
    public void deleteTask(String userEmail, UUID id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        taskRepository.delete(task);
    }

    public List<TaskResponse> getUpcomingTasks(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return taskRepository.findUpcomingTasks(user, LocalDateTime.now()).stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }

    public TaskStatsResponse getTaskStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long total = taskRepository.countByUser(user);
        long todo = taskRepository.countByUserAndStatus(user, TaskStatus.TODO);
        long inProgress = taskRepository.countByUserAndStatus(user, TaskStatus.IN_PROGRESS);
        long completed = taskRepository.countByUserAndStatus(user, TaskStatus.COMPLETED);
        long archived = taskRepository.countByUserAndStatus(user, TaskStatus.ARCHIVED);

        return TaskStatsResponse.builder()
                .total(total)
                .todo(todo)
                .inProgress(inProgress)
                .completed(completed)
                .archived(archived)
                .build();
    }

    private TaskResponse toTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .categoryId(task.getCategory() != null ? task.getCategory().getId() : null)
                .categoryName(task.getCategory() != null ? task.getCategory().getName() : null)
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .completedAt(task.getCompletedAt())
                .keepAfterCompletion(task.getKeepAfterCompletion())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
