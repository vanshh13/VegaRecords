import { api } from "./api";

export const taskApi = {
  // GET /tasks
  getAll: async (params = {}) => {
    const res = await api.get("/tasks", { params });
    if (res.data && Array.isArray(res.data.content)) {
      return res.data.content;
    }
    return Array.isArray(res.data) ? res.data : [];
  },

  // GET /tasks/{id}
  getById: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  // POST /tasks
  create: async (data) => {
    const res = await api.post("/tasks", data);
    return res.data;
  },

  // PUT /tasks/{id}
  update: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  // PATCH /tasks/{id}/status
  updateStatus: async (id, status) => {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data;
  },

  // DELETE /tasks/{id}
  delete: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  // GET /tasks/stats
  getStats: async () => {
    const res = await api.get("/tasks/stats");
    return res.data;
  },
};
