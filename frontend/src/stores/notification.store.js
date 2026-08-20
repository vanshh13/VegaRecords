import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notificationApi } from "@/apis/notification.api";

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      filter: "ALL", // 'ALL' | 'UNREAD' | 'REMINDER' | 'SYSTEM'
      loading: false,

      setFilter: (filter) => set({ filter }),

      fetchNotifications: async () => {
        set({ loading: true });
        try {
          const res = await notificationApi.getNotifications(0, 50);
          const data = res?.content || res || [];
          set({ notifications: Array.isArray(data) ? data : [], loading: false });
        } catch (err) {
          console.warn("Failed to fetch notifications from backend", err);
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
