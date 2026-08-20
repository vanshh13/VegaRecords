import { create } from "zustand";
import { trackerApi } from "@/apis/tracker.api";

export const useTrackerStore = create((set, get) => ({
  trackers: [],
  selectedTracker: null,
  activeTrackerDetail: null,
  trackerValues: [],
  pagination: { page: 0, size: 12, totalPages: 1, totalElements: 0 },
  viewMode: "grid", // "grid" | "library" | "progress" | "collections"
  filters: { trackerTypeId: null, status: null, search: "", isFavorite: false },
  drawerOpen: false,
  editingTracker: null,
  isLoading: false,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters }, pagination: { ...state.pagination, page: 0 } }));
    get().fetchTrackers();
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedTracker: (tracker) => set({ selectedTracker: tracker }),

  openDrawer: (tracker = null) => set({ editingTracker: tracker, drawerOpen: true }),
  closeDrawer: () => set({ editingTracker: null, drawerOpen: false }),

  fetchTrackers: async () => {
    set({ isLoading: true });
    try {
      const { filters, pagination } = get();
      const params = {
        page: pagination.page,
        size: pagination.size,
        ...(filters.trackerTypeId && { trackerTypeId: filters.trackerTypeId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      };

      const res = await trackerApi.getAll(params);
      let content = res.content || [];
      if (filters.isFavorite) {
        content = content.filter((t) => t.isFavorite);
      }

      set({
        trackers: content,
        pagination: {
          ...pagination,
          totalPages: res.totalPages || 1,
          totalElements: res.totalElements || content.length,
        },
      });
    } catch {
      set({ trackers: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrackerById: async (id) => {
    set({ isLoading: true });
    try {
      const detail = await trackerApi.getById(id);
      const values = await trackerApi.getValues(id);
      set({ activeTrackerDetail: detail, trackerValues: values || [] });
      return detail;
    } finally {
      set({ isLoading: false });
    }
  },

  createTracker: async (payload) => {
    set({ isLoading: true });
    try {
      const created = await trackerApi.create(payload);
      get().fetchTrackers();
      return created;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTracker: async (id, payload) => {
    set({ isLoading: true });
    try {
      const updated = await trackerApi.update(id, payload);
      get().fetchTrackers();
      if (get().activeTrackerDetail?.id === id) {
        set({ activeTrackerDetail: updated });
      }
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      const updated = await trackerApi.updateStatus(id, status);
      get().fetchTrackers();
      if (get().activeTrackerDetail?.id === id) {
        set({ activeTrackerDetail: updated });
      }
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },

  // Gamified +1 Quick Increment Action
  quickIncrementProgress: async (tracker, step = 1) => {
    const current = tracker.currentCount || 0;
    const target = tracker.targetCount || 100;
    const nextVal = Math.min(current + step, target);
    const newStatus = nextVal >= target ? "COMPLETED" : "IN_PROGRESS";

    // Optimistic UI update
    set((state) => ({
      trackers: state.trackers.map((t) =>
        t.id === tracker.id ? { ...t, currentCount: nextVal, status: newStatus } : t
      ),
      activeTrackerDetail:
        state.activeTrackerDetail?.id === tracker.id
          ? { ...state.activeTrackerDetail, currentCount: nextVal, status: newStatus }
          : state.activeTrackerDetail,
    }));

    try {
      await trackerApi.update(tracker.id, {
        title: tracker.title,
        status: newStatus,
        currentCount: nextVal,
        targetCount: target,
        trackerTypeId: tracker.trackerType?.id,
        isFavorite: tracker.isFavorite,
      });
      // Record progress log entry in values
      await trackerApi.saveValue(tracker.id, {
        value: `Progress updated to ${nextVal} (+${step})`,
        loggedAt: new Date().toISOString(),
      });
      get().fetchTrackers();
    } catch {
      get().fetchTrackers();
    }
  },

  deleteTracker: async (id) => {
    set({ isLoading: true });
    try {
      await trackerApi.delete(id);
      get().fetchTrackers();
    } finally {
      set({ isLoading: false });
    }
  },
}));
