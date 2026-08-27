import { create } from "zustand";
import { persist } from "zustand/middleware";
import { activityApi } from "@/apis/activity.api";

const INITIAL_ACTIVITIES = [
  {
    id: "act-1",
    entityType: "TASK",
    action: "COMPLETE",
    title: "Completed Task: Setup Spring Security & Flyway Migrations",
    description: "Successfully executed migration scripts and passed integration tests.",
    level: "Level 1 Priority: High",
    priority: "HIGH",
    timestamp: new Date().toISOString(),
  },
  {
    id: "act-2",
    entityType: "TRACKER",
    action: "UPDATE",
    title: "Updated Tracker Set: One Piece Series (EP 1095 / 1100)",
    description: "Pushed latest anime watch progress set values to workspace database.",
    level: "Level 0 Set: Active",
    priority: "MEDIUM",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "act-3",
    entityType: "CATEGORY",
    action: "CREATE",
    title: "Created Category Tree Node: Level 2 Sub-tree 'Neon PostgreSQL'",
    description: "Nested under Level 1 Parent 'Spring Boot Backend Architecture'.",
    level: "Level 2 Sub-tree",
    priority: "LOW",
    timestamp: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "act-4",
    entityType: "NOTE",
    action: "CREATE",
    title: "Created Knowledge Note: Notion-Style Recursive Tree Architecture",
    description: "Documented parent-child tree mapping algorithms for Category Explorer.",
    level: "Level 1 Category: Software",
    priority: "MEDIUM",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "act-5",
    entityType: "RESOURCE",
    action: "CREATE",
    title: "Bookmarked Resource: Canvas 2D Pseudo-3D Orthographic Math",
    description: "Added external documentation link to resource bookmark set.",
    level: "Level 0 Set: Bookmarks",
    priority: "LOW",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useActivityStore = create(
  persist(
    (set, get) => ({
      activities: INITIAL_ACTIVITIES,
      filter: "ALL", // 'ALL' | 'TASK' | 'TRACKER' | 'NOTE' | 'RESOURCE' | 'CATEGORY' | 'HIGH_PRIORITY' | 'TREE_LEVELS'
      loading: false,

      setFilter: (filter) => set({ filter }),

      fetchActivities: async () => {
        set({ loading: true });
        try {
          const res = await activityApi.getActivities(0, 50);
          const data = res?.content || res || [];
          if (Array.isArray(data) && data.length > 0) {
            set({ activities: data, loading: false });
          } else {
            set({ loading: false });
          }
        } catch (err) {
          console.warn("Failed to fetch activity from backend, using local store", err);
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
