package com.vegarecords.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private UUID id;
    private String title;
    private String description;
    private UUID categoryId;
    private String categoryName;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
    private Boolean keepAfterCompletion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
