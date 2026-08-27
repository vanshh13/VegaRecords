import { create } from "zustand";
import { trackerApi } from "@/apis/tracker.api";

export const useTrackerStore = create((set, get) => ({
  trackers: [],
  selectedTracker: null,
  activeTrackerDetail: null,
  trackerValues: [],
  pagination: { page: 0, size: 12, totalPages: 1, totalElements: 0 },
  viewMode: "grid", // "grid" | "library" | "progress" | "collections"
  filters: { trackerTypeId: null, categoryId: null, status: null, search: "", isFavorite: false },
  drawerOpen: false,
  editingTracker: null,
  isCategorySidebarOpen: false,
  isLoading: false,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters }, pagination: { ...state.pagination, page: 0 } }));
    get().fetchTrackers();
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedTracker: (tracker) => set({ selectedTracker: tracker }),

  openDrawer: (tracker = null) => set({ editingTracker: tracker, drawerOpen: true }),
  closeDrawer: () => set({ editingTracker: null, drawerOpen: false }),

  openCategorySidebar: () => set({ isCategorySidebarOpen: true }),
  closeCategorySidebar: () => set({ isCategorySidebarOpen: false }),
  toggleCategorySidebar: () => set((state) => ({ isCategorySidebarOpen: !state.isCategorySidebarOpen })),

  fetchTrackers: async () => {
    set({ isLoading: true });
    try {
      const { filters, pagination } = get();
      const params = {
        page: pagination.page,
        size: pagination.size,
        ...(filters.trackerTypeId && { trackerTypeId: filters.trackerTypeId }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      };

      const res = await trackerApi.getAll(params);
      let content = res.content || [];

      if (filters.categoryId) {
        content = content.filter((t) => {
          if (t.categoryId === filters.categoryId) return true;
          if (t.category?.id === filters.categoryId) return true;
          if (t.categories && t.categories.some((c) => c.id === filters.categoryId)) return true;
          return false;
        });
      }

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

  toggleFavoriteTracker: async (tracker) => {
    const newFav = !tracker.isFavorite;
    set((state) => ({
      trackers: state.trackers.map((t) => (t.id === tracker.id ? { ...t, isFavorite: newFav } : t)),
      activeTrackerDetail:
        state.activeTrackerDetail?.id === tracker.id
          ? { ...state.activeTrackerDetail, isFavorite: newFav }
          : state.activeTrackerDetail,
    }));

    try {
      await trackerApi.update(tracker.id, {
        title: tracker.title,
        trackerTypeId: tracker.trackerTypeId || tracker.trackerType?.id,
        isFavorite: newFav,
        status: tracker.status,
        currentCount: tracker.currentCount,
        targetCount: tracker.targetCount,
        unitLabel: tracker.unitLabel,
        rating: tracker.rating,
        coverUrl: tracker.coverUrl,
        notes: tracker.notes,
        isOngoing: tracker.isOngoing,
        categoryIds: tracker.categoryIds || (tracker.categories ? tracker.categories.map((c) => c.id) : []),
      });
    } catch {
      get().fetchTrackers();
    }
  },

  updateStatus: async (id, status) => {
    // Optimistic UI update for immediate reactivity without refresh
    set((state) => {
      const isTargetComplete = status === "COMPLETED";
      const updateObj = (t) => {
        if (t.id !== id) return t;
        const newCount = (isTargetComplete && t.targetCount > 0 && !t.isOngoing) ? t.targetCount : t.currentCount;
        return { ...t, status, currentCount: newCount };
      };
      return {
        trackers: state.trackers.map(updateObj),
        activeTrackerDetail: state.activeTrackerDetail?.id === id ? updateObj(state.activeTrackerDetail) : state.activeTrackerDetail,
      };
    });

    try {
      const activeTracker = get().activeTrackerDetail;
      let updated;
      if (status === "COMPLETED" && activeTracker && activeTracker.targetCount > 0 && !activeTracker.isOngoing) {
        updated = await trackerApi.update(id, {
          title: activeTracker.title,
          status: "COMPLETED",
          currentCount: activeTracker.targetCount,
          targetCount: activeTracker.targetCount,
          trackerTypeId: activeTracker.trackerTypeId || activeTracker.trackerType?.id || null,
          isOngoing: activeTracker.isOngoing,
          isFavorite: activeTracker.isFavorite,
        });
      } else {
        updated = await trackerApi.updateStatus(id, status);
      }
      get().fetchTrackers();
      if (get().activeTrackerDetail?.id === id) {
        set({ activeTrackerDetail: updated });
      }
      return updated;
    } catch {
      get().fetchTrackers();
    }
  },

  // Set explicit count / jump to episode (e.g. jumped to Ep 500 or started halfway)
  setCustomProgressCount: async (tracker, customVal, noteReason = "") => {
    const nextVal = Math.max(0, Number(customVal) || 0);
    const target = tracker.targetCount || 0;
    const isInfinite = tracker.isOngoing || target === 0;
    const newStatus = (!isInfinite && target > 0 && nextVal >= target) ? "COMPLETED" : (tracker.status || "IN_PROGRESS");

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
        trackerTypeId: tracker.trackerTypeId || tracker.trackerType?.id || null,
        isOngoing: tracker.isOngoing,
        isFavorite: tracker.isFavorite,
      });
      const defaultFieldId = tracker.trackerType?.fields?.[0]?.id || tracker.fields?.[0]?.id || null;
      await trackerApi.saveValue(tracker.id, {
        fieldId: defaultFieldId,
        value: noteReason ? `Jumped to ${nextVal}: ${noteReason}` : `Progress set to ${nextVal}`,
        loggedAt: new Date().toISOString(),
      });
      get().fetchTrackers();
      if (get().activeTrackerDetail?.id === tracker.id) {
        const updatedValues = await trackerApi.getValues(tracker.id);
        set({ trackerValues: updatedValues || [] });
      }
    } catch {
      get().fetchTrackers();
    }
  },

  // Gamified Quick Increment Action
  quickIncrementProgress: async (tracker, step = 1) => {
    const current = tracker.currentCount || 0;
    const target = tracker.targetCount || 0;
    const isInfinite = tracker.isOngoing || target === 0;
    const nextVal = isInfinite ? (current + step) : Math.min(current + step, target);
    const newStatus = (!isInfinite && target > 0 && nextVal >= target) ? "COMPLETED" : (tracker.status || "IN_PROGRESS");

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
        trackerTypeId: tracker.trackerTypeId || tracker.trackerType?.id || null,
        isOngoing: tracker.isOngoing,
        isFavorite: tracker.isFavorite,
      });
      // Record progress log entry in values
      const defaultFieldId = tracker.trackerType?.fields?.[0]?.id || tracker.fields?.[0]?.id || null;
      await trackerApi.saveValue(tracker.id, {
        fieldId: defaultFieldId,
        value: `Progress updated to ${nextVal} (+${step})`,
        loggedAt: new Date().toISOString(),
      });
      get().fetchTrackers();
      if (get().activeTrackerDetail?.id === tracker.id) {
        const updatedValues = await trackerApi.getValues(tracker.id);
        set({ trackerValues: updatedValues || [] });
      }
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
