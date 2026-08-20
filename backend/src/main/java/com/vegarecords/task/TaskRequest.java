package com.vegarecords.task;

import jakarta.validation.constraints.NotBlank;
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
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;
    private UUID categoryId;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private Boolean keepAfterCompletion;
}
