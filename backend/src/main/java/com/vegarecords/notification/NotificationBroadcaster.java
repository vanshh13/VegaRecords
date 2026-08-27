package com.vegarecords.notification;

import com.vegarecords.activity.ActivityLogResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationBroadcaster {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastNotification(NotificationResponse notification) {
        try {
            log.info("Broadcasting real-time notification over WebSocket: {}", notification.getTitle());
            messagingTemplate.convertAndSend("/topic/notifications", notification);
        } catch (Exception e) {
            log.warn("Failed to broadcast notification over WebSocket", e);
        }
    }

    public void broadcastActivity(ActivityLogResponse activity) {
        try {
            log.info("Broadcasting real-time activity log over WebSocket: {}", activity.getTitle());
            messagingTemplate.convertAndSend("/topic/activity", activity);
        } catch (Exception e) {
            log.warn("Failed to broadcast activity over WebSocket", e);
        }
    }
}
