package com.vegarecords.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activity")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<Page<ActivityLogResponse>> getUserActivity(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ActivityLogResponse> activity = activityLogService.getUserActivity(authentication.getName(), page, size);
        return ResponseEntity.ok(activity);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ActivityLogResponse>> getRecentActivity(Authentication authentication) {
        List<ActivityLogResponse> recent = activityLogService.getRecentActivity(authentication.getName());
        return ResponseEntity.ok(recent);
    }
}
