import { api } from "./api";

export const resourceApi = {
  // GET /resources
  getAll: async (params = {}) => {
    const res = await api.get("/resources", { params });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /resources/favorites
  getFavorites: async () => {
    const res = await api.get("/resources/favorites");
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /resources/{id}
  getById: async (id) => {
    const res = await api.get(`/resources/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // POST /resources
  create: async (payload) => {
    const res = await api.post("/resources", payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // PUT /resources/{id}
  update: async (id, payload) => {
    const res = await api.put(`/resources/${id}`, payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // DELETE /resources/{id}
  delete: async (id) => {
    const res = await api.delete(`/resources/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
