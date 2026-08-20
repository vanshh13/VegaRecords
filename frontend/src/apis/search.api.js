import { api } from "./api";

export const searchApi = {
  globalSearch: async (query) => {
    const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
