import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_WIDGETS = {
  greeting: true,
  quickActions: true,
  trackersContinue: true,
  todayTasks: true,
  recentActivity: true,
  trackerSummary: true,
  categoriesOverview: true,
};

export const useDashboardStore = create(
  persist(
    (set) => ({
      widgets: DEFAULT_WIDGETS,
      isEditLayoutOpen: false,

      toggleWidget: (key) =>
        set((state) => ({
          widgets: { ...state.widgets, [key]: !state.widgets[key] },
        })),

      resetLayout: () => set({ widgets: DEFAULT_WIDGETS }),
      toggleEditLayout: () => set((state) => ({ isEditLayoutOpen: !state.isEditLayoutOpen })),
    }),
    {
      name: "vega-dashboard-layout",
    }
  )
);
