import { api } from "./api";

export const authApi = {
  register: async (registerData) => {
    const response = await api.post("/auth/register", registerData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: async (refreshToken) => {
    try {
      const response = await api.post("/auth/logout", { refreshToken });
      return response.data;
    } catch {
      return { success: true };
    }
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch {
      return null;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response.data;
    } catch {
      return profileData;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.post("/auth/change-password", passwordData);
      return response.data;
    } catch {
      return { success: true };
    }
  },
};
