import { create } from "zustand";
import { taskApi } from "@/apis/task.api";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  selectedTaskId: null,
  viewMode: "list", // "list" | "board" | "timeline"
  isLoading: false,

  // Filters
  filters: {
    status: "ALL",
    priority: "ALL",
    categoryId: "ALL",
    search: "",
  },

  // Drawer state
  isDrawerOpen: false,
  drawerMode: "create", // "create" | "edit"
  editingTask: null,

  // Category Overlay Sidebar state
  isCategorySidebarOpen: false,

  // Actions
  openCategorySidebar: () => set({ isCategorySidebarOpen: true }),
  closeCategorySidebar: () => set({ isCategorySidebarOpen: false }),
  toggleCategorySidebar: () => set((state) => ({ isCategorySidebarOpen: !state.isCategorySidebarOpen })),

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const data = await taskApi.getAll();
      if (Array.isArray(data)) {
        set({ tasks: data });
      }
    } catch {
      set({ tasks: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => {
    set({
      filters: { status: "ALL", priority: "ALL", categoryId: "ALL", search: "" },
    });
  },

  selectTask: (id) => {
    set({ selectedTaskId: id });
  },

  toggleTaskStatus: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
    const newProgress = newStatus === "COMPLETED" ? 100 : 0;

    try {
      await taskApi.updateStatus(id, newStatus);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, status: newStatus, progress: newProgress } : t
        ),
      }));
    } catch {
      // Handled by API interceptor / caller
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      await taskApi.updateStatus(id, status);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                progress: status === "COMPLETED" ? 100 : status === "IN_PROGRESS" ? 50 : 0,
              }
            : t
        ),
      }));
    } catch {
      // Handled by API interceptor / caller
    }
  },

  openCreateDrawer: (preselectedCategoryId = null) => {
    set({
      isDrawerOpen: true,
      drawerMode: "create",
      editingTask: preselectedCategoryId ? { categoryId: preselectedCategoryId } : null,
    });
  },

  openEditDrawer: (task) => {
    set({
      isDrawerOpen: true,
      drawerMode: "edit",
      editingTask: task,
    });
  },

  closeDrawer: () => {
    set({
      isDrawerOpen: false,
      editingTask: null,
    });
  },

  addTask: async (taskData) => {
    try {
      const created = await taskApi.create(taskData);
      set((state) => ({
        tasks: [created, ...state.tasks],
        isDrawerOpen: false,
      }));
    } catch {
      // Handled by API interceptor / caller
    }
  },

  updateTask: async (id, updatedFields) => {
    try {
      await taskApi.update(id, updatedFields);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
        isDrawerOpen: false,
        editingTask: null,
      }));
    } catch {
      // Handled by API interceptor / caller
    }
  },

  deleteTask: async (id) => {
    try {
      await taskApi.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
      }));
    } catch {
      // Handled by API interceptor / caller
    }
  },
}));
