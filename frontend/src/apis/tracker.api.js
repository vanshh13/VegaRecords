import { api } from "./api";

export const trackerApi = {
  // GET /trackers
  getAll: async (params = {}) => {
    const res = await api.get("/trackers", { params });
    const payload = res.data?.data !== undefined ? res.data.data : res.data;
    if (payload?.content) {
      return {
        content: payload.content,
        totalPages: payload.totalPages,
        totalElements: payload.totalElements,
        number: payload.number,
      };
    }
    return { content: Array.isArray(payload) ? payload : [], totalPages: 1, totalElements: 0, number: 0 };
  },

  // GET /trackers/{id}
  getById: async (id) => {
    const res = await api.get(`/trackers/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // POST /trackers
  create: async (payload) => {
    const res = await api.post("/trackers", payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // PUT /trackers/{id}
  update: async (id, payload) => {
    const res = await api.put(`/trackers/${id}`, payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // PATCH /trackers/{id}/status
  updateStatus: async (id, status) => {
    const res = await api.patch(`/trackers/${id}/status`, { status });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // DELETE /trackers/{id}
  delete: async (id) => {
    const res = await api.delete(`/trackers/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // POST /trackers/{id}/values
  saveValue: async (id, valuePayload) => {
    const res = await api.post(`/trackers/${id}/values`, valuePayload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /trackers/{id}/values
  getValues: async (id) => {
    const res = await api.get(`/trackers/${id}/values`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
