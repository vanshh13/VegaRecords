import { create } from "zustand";
import { trackerTypeApi } from "@/apis/trackerType.api";

export const useTrackerTypeStore = create((set, get) => ({
  trackerTypes: [],
  selectedType: null,
  drawerOpen: false,
  editingType: null,
  fieldBuilderOpen: false,
  activeFieldType: null,
  isLoading: false,

  openDrawer: (type = null) => set({ editingType: type, drawerOpen: true }),
  closeDrawer: () => set({ editingType: null, drawerOpen: false }),

  openFieldBuilder: (type) => set({ activeFieldType: type, fieldBuilderOpen: true }),
  closeFieldBuilder: () => set({ activeFieldType: null, fieldBuilderOpen: false }),

  fetchTrackerTypes: async () => {
    set({ isLoading: true });
    try {
      const res = await trackerTypeApi.getAll();
      set({ trackerTypes: Array.isArray(res) ? res : [] });
    } catch {
      set({ trackerTypes: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createTrackerType: async (payload) => {
    set({ isLoading: true });
    try {
      const created = await trackerTypeApi.create(payload);
      get().fetchTrackerTypes();
      return created;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTrackerType: async (id, payload) => {
    set({ isLoading: true });
    try {
      const updated = await trackerTypeApi.update(id, payload);
      get().fetchTrackerTypes();
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },

  addFieldToType: async (id, fieldPayload) => {
    set({ isLoading: true });
    try {
      const updated = await trackerTypeApi.addField(id, fieldPayload);
      get().fetchTrackerTypes();
      if (get().activeFieldType?.id === id) {
        set({ activeFieldType: updated });
      }
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTrackerType: async (id) => {
    set({ isLoading: true });
    try {
      await trackerTypeApi.delete(id);
      get().fetchTrackerTypes();
    } finally {
      set({ isLoading: false });
    }
  },
}));
