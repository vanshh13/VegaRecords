import { create } from "zustand";
import { noteApi } from "@/apis/note.api";

export const useNoteStore = create((set, get) => ({
  notes: [],
  pagination: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 1,
  },
  viewMode: "grid", // "grid" | "list" | "workspace"
  filters: {
    categoryId: null,
    trackerId: null,
    isFavorite: false,
    search: "",
  },
  selectedNote: null,
  activeNoteDetail: null,
  isLoading: false,
  drawerOpen: false,
  editingNote: null,
  isCategorySidebarOpen: false,

  openCategorySidebar: () => set({ isCategorySidebarOpen: true }),
  closeCategorySidebar: () => set({ isCategorySidebarOpen: false }),
  toggleCategorySidebar: () => set((state) => ({ isCategorySidebarOpen: !state.isCategorySidebarOpen })),

  setViewMode: (mode) => set({ viewMode: mode }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 0 },
    }));
    get().fetchNotes();
  },

  resetFilters: () => {
    set({
      filters: { categoryId: null, trackerId: null, isFavorite: false, search: "" },
      pagination: { page: 0, size: 20, totalElements: 0, totalPages: 1 },
    });
    get().fetchNotes();
  },

  openDrawer: (note = null) => {
    set({ editingNote: note, drawerOpen: true });
  },

  closeDrawer: () => {
    set({ editingNote: null, drawerOpen: false });
  },

  setSelectedNote: (note) => set({ selectedNote: note }),

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const { filters, pagination } = get();
      const params = {
        page: pagination.page,
        size: pagination.size,
      };

      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.trackerId) params.trackerId = filters.trackerId;
      if (filters.isFavorite) params.isFavorite = true;
      if (filters.search) params.search = filters.search;

      const res = await noteApi.getAll(params);
      const data = res?.content ? res : { content: Array.isArray(res) ? res : [], totalElements: 0, totalPages: 1 };

      set({
        notes: data.content || [],
        pagination: {
          ...pagination,
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 1,
        },
      });
    } catch {
      set({ notes: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNoteById: async (id) => {
    set({ isLoading: true });
    try {
      const note = await noteApi.getById(id);
      set({ activeNoteDetail: note });
      return note;
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (payload) => {
    set({ isLoading: true });
    try {
      const created = await noteApi.create(payload);
      get().fetchNotes();
      return created;
    } finally {
      set({ isLoading: false });
    }
  },

  updateNote: async (id, payload) => {
    set({ isLoading: true });
    try {
      const updated = await noteApi.update(id, payload);
      get().fetchNotes();
      if (get().selectedNote?.id === id) {
        set({ selectedNote: updated });
      }
      if (get().activeNoteDetail?.id === id) {
        set({ activeNoteDetail: updated });
      }
      return updated;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (note) => {
    const newFav = !note.isFavorite;
    set((state) => ({
      notes: state.notes.map((n) => (n.id === note.id ? { ...n, isFavorite: newFav } : n)),
    }));

    try {
      const payload = {
        title: note.title,
        content: note.content,
        categoryId: note.categoryId,
        trackerId: note.trackerId,
        isFavorite: newFav,
      };
      await noteApi.update(note.id, payload);
    } catch {
      set((state) => ({
        notes: state.notes.map((n) => (n.id === note.id ? { ...n, isFavorite: note.isFavorite } : n)),
      }));
    }
  },

  deleteNote: async (id) => {
    set({ isLoading: true });
    try {
      await noteApi.delete(id);
      if (get().selectedNote?.id === id) {
        set({ selectedNote: null });
      }
      if (get().activeNoteDetail?.id === id) {
        set({ activeNoteDetail: null });
      }
      get().fetchNotes();
    } finally {
      set({ isLoading: false });
    }
  },
}));
