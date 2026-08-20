import { create } from "zustand";
import { resourceApi } from "@/apis/resource.api";

export const useResourceStore = create((set, get) => ({
  resources: [],
  pagination: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 1,
  },
  viewMode: "grid", // "grid" | "list" | "wall"
  filters: {
    categoryId: null,
    resourceType: null,
    isFavorite: false,
    search: "",
  },
  isLoading: false,
  drawerOpen: false,
  editingResource: null,
  isCategorySidebarOpen: false,

  openCategorySidebar: () => set({ isCategorySidebarOpen: true }),
  closeCategorySidebar: () => set({ isCategorySidebarOpen: false }),
  toggleCategorySidebar: () => set((state) => ({ isCategorySidebarOpen: !state.isCategorySidebarOpen })),

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 0 },
    }));
    get().fetchResources();
  },

  resetFilters: () => {
    set({
      filters: { categoryId: null, resourceType: null, isFavorite: false, search: "" },
      pagination: { page: 0, size: 20, totalElements: 0, totalPages: 1 },
    });
    get().fetchResources();
  },

  openDrawer: (resource = null) => {
    set({ editingResource: resource, drawerOpen: true });
  },

  closeDrawer: () => {
    set({ editingResource: null, drawerOpen: false });
  },

  setSelectedResource: (resource) => set({ selectedResource: resource }),

  fetchResources: async () => {
    set({ isLoading: true });
    try {
      const { filters, pagination } = get();
      const params = {
        page: pagination.page,
        size: pagination.size,
      };

      if (filters.resourceType) params.resourceType = filters.resourceType;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.search) params.search = filters.search;

      let data;
      if (filters.isFavorite) {
        const favs = await resourceApi.getFavorites();
        data = { content: Array.isArray(favs) ? favs : [], totalElements: favs.length, totalPages: 1 };
      } else {
        const res = await resourceApi.getAll(params);
        data = res?.content ? res : { content: Array.isArray(res) ? res : [], totalElements: 0, totalPages: 1 };
      }

      set({
        resources: data.content || [],
        pagination: {
          ...pagination,
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 1,
        },
      });
    } catch {
      set({ resources: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createResource: async (payload) => {
    set({ isLoading: true });
    try {
      const created = await resourceApi.create(payload);
      get().fetchResources();
      return created;
    } finally {
      set({ isLoading: false });
    }
  },

  updateResource: async (id, payload) => {
    set({ isLoading: true });
    try {
      const updated = await resourceApi.update(id, payload);
      get().fetchResources();
      if (get().selectedResource?.id === id) {
        set({ selectedResource: updated });
      }
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (resource) => {
    const newFav = !resource.isFavorite;
    // Optimistic update
    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === resource.id ? { ...r, isFavorite: newFav } : r
      ),
    }));

    try {
      const payload = {
        title: resource.title,
        url: resource.url,
        resourceType: resource.resourceType,
        notes: resource.notes,
        isFavorite: newFav,
        categoryIds: resource.categories ? resource.categories.map((c) => c.id) : [],
      };
      await resourceApi.update(resource.id, payload);
    } catch {
      // Revert if failed
      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === resource.id ? { ...r, isFavorite: resource.isFavorite } : r
        ),
      }));
    }
  },

  deleteResource: async (id) => {
    set({ isLoading: true });
    try {
      await resourceApi.delete(id);
      if (get().selectedResource?.id === id) {
        set({ selectedResource: null });
      }
      get().fetchResources();
    } finally {
      set({ isLoading: false });
    }
  },
}));
