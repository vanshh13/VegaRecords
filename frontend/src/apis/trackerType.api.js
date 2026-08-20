import { api } from "./api";

export const trackerTypeApi = {
  // GET /tracker-types
  getAll: async () => {
    const res = await api.get("/tracker-types");
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /tracker-types/{id}
  getById: async (id) => {
    const res = await api.get(`/tracker-types/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // POST /tracker-types
  create: async (payload) => {
    const res = await api.post("/tracker-types", payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // PUT /tracker-types/{id}
  update: async (id, payload) => {
    const res = await api.put(`/tracker-types/${id}`, payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // DELETE /tracker-types/{id}
  delete: async (id) => {
    const res = await api.delete(`/tracker-types/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // POST /tracker-types/{id}/fields
  addField: async (id, fieldPayload) => {
    const res = await api.post(`/tracker-types/${id}/fields`, fieldPayload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
