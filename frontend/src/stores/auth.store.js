import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: true,

      setAuth: ({ user, accessToken, refreshToken }) => {
        set({
          user: user || get().user,
          accessToken: accessToken || get().accessToken,
          refreshToken: refreshToken || get().refreshToken,
          isAuthenticated: true,
          loading: false,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : updatedFields,
        }));
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      setLoading: (loading) => {
        set({ loading });
      },
    }),
    {
      name: "vegarecords-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);
