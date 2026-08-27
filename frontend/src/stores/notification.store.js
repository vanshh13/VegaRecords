import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notificationApi } from "@/apis/notification.api";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Task Priority Alert: High Level Due Today",
    message: "Spring Boot Microservices Security task is scheduled for completion at High Level priority.",
    type: "CRITICAL",
    entityType: "TASK",
    level: "Level 1 Priority",
    priority: "HIGH",
    isRead: false,
    timestamp: new Date().toISOString(),
    link: "/tasks",
  },
  {
    id: "notif-2",
    title: "Tracker Milestone: Ep 1095 Achieved!",
    message: "One Piece Anime Series tracker updated set value (EP 1095 / 1100).",
    type: "MILESTONE",
    entityType: "TRACKER",
    level: "Level 0 Set",
    priority: "MEDIUM",
    isRead: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    link: "/trackers",
  },
  {
    id: "notif-3",
    title: "Category Node Added: L2 Flyway Sub-Tree",
    message: "New sub-category node created under Software Engineering -> Backend Architecture.",
    type: "INFO",
    entityType: "CATEGORY",
    level: "Level 2 Sub-tree",
    priority: "LOW",
    isRead: true,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    link: "/categories",
  },
  {
    id: "notif-4",
    title: "System Synchronization Complete",
    message: "All 5 dynamic tracker sets and 12 category tree nodes are fully synchronized.",
    type: "SUCCESS",
    entityType: "SYSTEM",
    level: "Root Level",
    priority: "LOW",
    isRead: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: INITIAL_NOTIFICATIONS,
      filter: "ALL", // 'ALL' | 'UNREAD' | 'CRITICAL' | 'WARNING' | 'MILESTONE' | 'REMINDER' | 'SUCCESS' | 'TASK' | 'TRACKER' | 'NOTE' | 'RESOURCE' | 'CATEGORY'
      loading: false,

      setFilter: (filter) => set({ filter }),

      fetchNotifications: async () => {
        set({ loading: true });
        try {
          const res = await notificationApi.getNotifications(0, 50);
          const data = res?.content || res || [];
          if (Array.isArray(data) && data.length > 0) {
            set({ notifications: data, loading: false });
          } else {
            set({ loading: false });
          }
        } catch (err) {
          console.warn("Failed to fetch notifications from backend, using local store", err);
          set({ loading: false });
        }
      },

      markAsRead: async (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
        try {
          await notificationApi.markAsRead(id);
        } catch (err) {
          console.warn("Failed to sync markAsRead to backend", err);
        }
      },

      markAllAsRead: async () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
        try {
          await notificationApi.markAllAsRead();
        } catch (err) {
          console.warn("Failed to sync markAllAsRead to backend", err);
        }
      },

      deleteNotification: async (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
        try {
          await notificationApi.deleteNotification(id);
        } catch (err) {
          console.warn("Failed to sync deleteNotification to backend", err);
        }
      },

      clearAll: () => set({ notifications: [] }),

      addNotification: (notif) => {
        const newNotif = {
          id: `notif-${Date.now()}`,
          isRead: false,
          timestamp: new Date().toISOString(),
          ...notif,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
      },
    }),
    {
      name: "vega-notification-storage",
    }
  )
);
