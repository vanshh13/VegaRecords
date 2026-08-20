package com.vegarecords.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatsResponse {

    private long total;
    private long todo;
    private long inProgress;
    private long completed;
    private long archived;
}
