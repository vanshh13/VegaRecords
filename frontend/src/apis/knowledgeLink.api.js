import { api } from "./api";

export const knowledgeLinkApi = {
  // POST /knowledge-links
  create: async (payload) => {
    const res = await api.post("/knowledge-links", payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // DELETE /knowledge-links/{id}
  delete: async (id) => {
    const res = await api.delete(`/knowledge-links/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /knowledge-links/entity/{type}/{id}
  getLinksForEntity: async (entityType, entityId) => {
    const res = await api.get(`/knowledge-links/entity/${entityType}/${entityId}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  // GET /knowledge-links/graph
  getFullGraph: async () => {
    const res = await api.get("/knowledge-links/graph");
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
