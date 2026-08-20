package com.vegarecords.notification;

import com.vegarecords.auth.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<NotificationResponse> notifications = notificationService.getNotifications(authentication.getName(), page, size);
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        NotificationResponse updated = notificationService.markAsRead(authentication.getName(), id);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead(Authentication authentication) {
        ApiResponse response = notificationService.markAllAsRead(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteNotification(
            Authentication authentication,
            @PathVariable UUID id
    ) {
        notificationService.deleteNotification(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Notification deleted successfully").build());
    }
}
