import { create } from "zustand";
import { adminApi } from "@/apis/admin.api";

export const useAdminStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  totalUsers: 0,
  totalPages: 1,
  currentPage: 0,
  isLoading: false,

  adminStats: {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalSystemCategories: 0,
  },

  filters: {
    search: "",
    statusFilter: "ALL", // "ALL" | "ACTIVE" | "INACTIVE"
    roleFilter: "ALL",   // "ALL" | "ADMIN" | "USER"
  },

  // Actions
  fetchUsers: async (page = 0) => {
    set({ isLoading: true });
    const { filters } = get();
    try {
      const params = {
        page,
        size: 15,
        search: filters.search.trim() || undefined,
        status: filters.statusFilter === "ACTIVE" ? true : filters.statusFilter === "INACTIVE" ? false : undefined,
      };
      const res = await adminApi.getUsers(params);
      let userList = res.content || [];

      // Filter by role client-side if roleFilter is active
      if (filters.roleFilter !== "ALL") {
        userList = userList.filter((u) => u.role === filters.roleFilter);
      }

      set({
        users: userList,
        totalUsers: res.totalElements || userList.length,
        totalPages: res.totalPages || 1,
        currentPage: page,
      });
    } catch {
      set({ users: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserById: async (id) => {
    set({ isLoading: true });
    try {
      const user = await adminApi.getUserById(id);
      set({ selectedUser: user });
      return user;
    } catch {
      set({ selectedUser: null });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAdminStats: async () => {
    try {
      const stats = await adminApi.getAdminStats();
      set({ adminStats: stats });
    } catch {
      // Keep state
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().fetchUsers(0);
  },

  toggleUserStatus: async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const updated = await adminApi.updateUserStatus(id, newStatus);
      set((state) => ({
        users: state.tasks ? state.users.map((u) => (u.id === id ? updated : u)) : state.users,
        selectedUser: state.selectedUser?.id === id ? updated : state.selectedUser,
      }));
      get().fetchUsers(get().currentPage);
      get().fetchAdminStats();
      return { success: true, updated };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Failed to update user status." };
    }
  },

  updateUserRole: async (id, newRole) => {
    try {
      const updated = await adminApi.updateUserRole(id, newRole);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updated : u)),
        selectedUser: state.selectedUser?.id === id ? updated : state.selectedUser,
      }));
      get().fetchUsers(get().currentPage);
      return { success: true, updated };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Failed to update user role." };
    }
  },
}));
