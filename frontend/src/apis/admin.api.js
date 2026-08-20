import { api } from "./api";

export const adminApi = {
  // GET /admin/users
  getUsers: async (params = {}) => {
    const res = await api.get("/admin/users", { params });
    const payload = res.data?.data !== undefined ? res.data.data : res.data;
    if (payload && Array.isArray(payload.content)) {
      return payload;
    }
    return { content: Array.isArray(payload) ? payload : [], totalElements: 0, totalPages: 1 };
  },

  // GET /admin/users/{id}
  getUserById: async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // PATCH /admin/users/{id}/status
  updateUserStatus: async (id, isActive) => {
    const res = await api.patch(`/admin/users/${id}/status`, { isActive });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // PATCH /admin/users/{id}/role
  updateUserRole: async (id, roleName) => {
    const res = await api.patch(`/admin/users/${id}/role`, { roleName });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /admin/stats
  getAdminStats: async () => {
    const res = await api.get("/admin/stats");
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
