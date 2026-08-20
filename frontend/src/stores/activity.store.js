import { create } from "zustand";
import { persist } from "zustand/middleware";
import { activityApi } from "@/apis/activity.api";

export const useActivityStore = create(
  persist(
    (set, get) => ({
      activities: [],
      filter: "ALL", // 'ALL' | 'TASK' | 'TRACKER' | 'NOTE' | 'RESOURCE' | 'CATEGORY'
      loading: false,

      setFilter: (filter) => set({ filter }),

      fetchActivities: async () => {
        set({ loading: true });
        try {
          const res = await activityApi.getActivities(0, 50);
          const data = res?.content || res || [];
          set({ activities: Array.isArray(data) ? data : [], loading: false });
        } catch (err) {
          console.warn("Failed to fetch activity from backend", err);
          set({ loading: false });
        }
      },

      addActivity: (activity) => {
        const newEntry = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...activity,
        };
        set((state) => ({
          activities: [newEntry, ...state.activities],
        }));
      },

      clearActivities: () => set({ activities: [] }),
    }),
    {
      name: "vega-activity-storage",
    }
  )
);
