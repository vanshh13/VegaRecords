import { api } from "./api";

export const notificationApi = {
  getNotifications: async (page = 0, size = 20) => {
    const res = await api.get(`/notifications?page=${page}&size=${size}`);
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await api.patch(`/notifications/read-all`);
    return res.data;
  },
  deleteNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },
};
