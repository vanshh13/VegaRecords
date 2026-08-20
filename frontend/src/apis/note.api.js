import { api } from "./api";

export const noteApi = {
  // GET /notes
  getAll: async (params = {}) => {
    const res = await api.get("/notes", { params });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /notes/{id}
  getById: async (id) => {
    const res = await api.get(`/notes/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // POST /notes
  create: async (payload) => {
    const res = await api.post("/notes", payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // PUT /notes/{id}
  update: async (id, payload) => {
    const res = await api.put(`/notes/${id}`, payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // DELETE /notes/{id}
  delete: async (id) => {
    const res = await api.delete(`/notes/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
