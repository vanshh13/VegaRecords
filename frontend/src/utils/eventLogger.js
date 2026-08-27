import { useActivityStore } from "@/stores/activity.store";
import { useNotificationStore } from "@/stores/notification.store";

/**
 * Event & Notification Logger for VegaRecords
 * --------------------------------------------
 * Centralized logging utility for all Entity Sets and Hierarchy/Priority Levels.
 *
 * Entity Sets:
 *  - TASK: Tasks, Subtasks, Priority Items
 *  - TRACKER: Custom Dynamic Trackers & Field Value Progress
 *  - NOTE: Knowledge Base Notes & Documents
 *  - RESOURCE: Bookmarks, Links, and Media Assets
 *  - CATEGORY: Notion-style Recursive Tree Nodes (Levels 0, 1, 2, 3+)
 *
 * Severity / Notification Levels:
 *  - CRITICAL: High-priority due dates or system errors
 *  - WARNING: Approaching deadlines or missing fields
 *  - SUCCESS: Task/Tracker completion or milestone achieved
 *  - MILESTONE: Major progress streak or category expansion
 *  - REMINDER: Scheduled task/activity alerts
 *  - INFO: General entity updates and node edits
 */

export function logSystemEvent({
  entityType = "TASK", // 'TASK' | 'TRACKER' | 'NOTE' | 'RESOURCE' | 'CATEGORY'
  entityId = null,
  action = "UPDATE", // 'CREATE' | 'UPDATE' | 'DELETE' | 'COMPLETE' | 'MILESTONE'
  title,
  description = "",
  level = "Level 0", // e.g. 'Level 0 (Root)', 'Level 1', 'Level 2', 'High Priority'
  priority = "MEDIUM", // 'HIGH' | 'MEDIUM' | 'LOW'
  notificationType = "INFO", // 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'MILESTONE' | 'REMINDER' | 'INFO'
  link = null,
}) {
  const timestamp = new Date().toISOString();

  // 1. Add entry to Activity Store
  useActivityStore.getState().addActivity({
    entityType,
    entityId,
    action,
    title,
    description,
    level,
    priority,
    timestamp,
  });

  // 2. Add entry to Notification Store if applicable
  if (notificationType) {
    useNotificationStore.getState().addNotification({
      title: title || `${action} on ${entityType}`,
      message: description || `Action executed on ${entityType} at ${level}`,
      type: notificationType,
      entityType,
      level,
      priority,
      link,
      timestamp,
    });
  }
}
