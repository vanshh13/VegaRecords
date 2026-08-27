package com.vegarecords.task;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    @JsonFormat(pattern = "yyyy-MM-dd['T'HH:mm:ss]")
    private LocalDateTime dueDate;
    private Boolean keepAfterCompletion;
}

