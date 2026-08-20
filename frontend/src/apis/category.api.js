import { api } from "./api";

export const categoryApi = {
  // GET /categories
  getAll: async () => {
    const res = await api.get("/categories");
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /categories/tree
  getTree: async () => {
    const res = await api.get("/categories/tree");
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /categories/{id}
  getById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // POST /categories
  create: async (data) => {
    const res = await api.post("/categories", data);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // PUT /categories/{id}
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // DELETE /categories/{id}
  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
