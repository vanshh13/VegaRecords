import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSearchStore = create(
  persist(
    (set, get) => ({
      isCommandPaletteOpen: false,
      searchQuery: "",
      recentSearches: ["Next.js 15", "Spring Boot Auth", "Tailwind v4", "Obsidian Wiki"],

      openCommandPalette: () => set({ isCommandPaletteOpen: true }),
      closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
      toggleCommandPalette: () =>
        set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      addRecentSearch: (term) => {
        if (!term || !term.trim()) return;
        const q = term.trim();
        set((state) => ({
          recentSearches: [q, ...state.recentSearches.filter((item) => item !== q)].slice(0, 8),
        }));
      },

      removeRecentSearch: (term) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((item) => item !== term),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "vega-search-storage",
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
