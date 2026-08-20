import { create } from "zustand";
import { categoryApi } from "@/apis/category.api";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  selectedCategoryId: null,
  expandedNodeIds: [],
  searchTerm: "",
  isLoading: false,

  // Drawer state
  isDrawerOpen: false,
  drawerMode: "create", // "create" | "edit"
  editingCategory: null,
  parentForNewChildId: null,

  // Actions
  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const data = await categoryApi.getAll();
      if (Array.isArray(data)) {
        set({
          categories: data,
          selectedCategoryId: get().selectedCategoryId || data[0]?.id || null,
        });
      }
    } catch {
      set({ categories: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  selectCategory: (id) => {
    set({ selectedCategoryId: id });
  },

  toggleNodeExpand: (id) => {
    const { expandedNodeIds } = get();
    if (expandedNodeIds.includes(id)) {
      set({ expandedNodeIds: expandedNodeIds.filter((nodeId) => nodeId !== id) });
    } else {
      set({ expandedNodeIds: [...expandedNodeIds, id] });
    }
  },

  expandAll: () => {
    const allIds = get().categories.map((c) => c.id);
    set({ expandedNodeIds: allIds });
  },

  collapseAll: () => {
    set({ expandedNodeIds: [] });
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  openCreateDrawer: (parentId = null) => {
    set({
      isDrawerOpen: true,
      drawerMode: "create",
      editingCategory: null,
      parentForNewChildId: parentId,
    });
  },

  openEditDrawer: (category) => {
    set({
      isDrawerOpen: true,
      drawerMode: "edit",
      editingCategory: category,
      parentForNewChildId: null,
    });
  },

  closeDrawer: () => {
    set({
      isDrawerOpen: false,
      editingCategory: null,
      parentForNewChildId: null,
    });
  },

  addCategory: async (categoryData) => {
    try {
      const created = await categoryApi.create(categoryData);
      const parentId = created.parentCategoryId || created.parentId;
      set((state) => {
        const updatedCategories = [...state.categories, created];
        const updatedExpanded = parentId
          ? Array.from(new Set([...state.expandedNodeIds, parentId]))
          : state.expandedNodeIds;

        return {
          categories: updatedCategories,
          selectedCategoryId: created.id,
          expandedNodeIds: updatedExpanded,
          isDrawerOpen: false,
        };
      });
    } catch {
      // API error handled by caller / interceptor
    }
  },

  updateCategory: async (id, updatedFields) => {
    try {
      await categoryApi.update(id, updatedFields);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, ...updatedFields } : cat
        ),
        isDrawerOpen: false,
        editingCategory: null,
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update category.";
      return { success: false, error: errorMsg };
    }
  },

  deleteCategory: async (id) => {
    try {
      await categoryApi.delete(id);
      set((state) => {
        const idsToDelete = new Set([id]);
        let changed = true;
        while (changed) {
          changed = false;
          state.categories.forEach((cat) => {
            const pId = cat.parentCategoryId || cat.parentId;
            if (pId && idsToDelete.has(pId) && !idsToDelete.has(cat.id)) {
              idsToDelete.add(cat.id);
              changed = true;
            }
          });
        }

        const filtered = state.categories.filter((cat) => !idsToDelete.has(cat.id));
        const remainingSelected =
          state.selectedCategoryId === id
            ? filtered[0]?.id || null
            : state.selectedCategoryId;

        return {
          categories: filtered,
          selectedCategoryId: remainingSelected,
        };
      });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete category.";
      return { success: false, error: errorMsg };
    }
  },
}));
