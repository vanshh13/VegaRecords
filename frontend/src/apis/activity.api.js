import { api } from "./api";

export const activityApi = {
  getActivities: async (page = 0, size = 20) => {
    const res = await api.get(`/activity?page=${page}&size=${size}`);
    return res.data;
  },
  getRecentActivities: async () => {
    const res = await api.get(`/activity/recent`);
    return res.data;
  },
};
