package com.vegarecords.search;

import com.vegarecords.note.NoteResponse;
import com.vegarecords.resource.ResourceResponse;
import com.vegarecords.task.TaskResponse;
import com.vegarecords.tracker.TrackerResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse {

    @Builder.Default
    private List<NoteResponse> notes = new ArrayList<>();

    @Builder.Default
    private List<ResourceResponse> resources = new ArrayList<>();

    @Builder.Default
    private List<TrackerResponse> trackers = new ArrayList<>();

    @Builder.Default
    private List<TaskResponse> tasks = new ArrayList<>();
}
