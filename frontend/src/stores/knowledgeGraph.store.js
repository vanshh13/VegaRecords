import { create } from "zustand";
import { knowledgeLinkApi } from "@/apis/knowledgeLink.api";

export const useKnowledgeGraphStore = create((set, get) => ({
  // Graph data
  nodes: [],
  edges: [],
  isLoading: false,
  error: null,

  // Filters
  activeFilters: new Set(["TASK", "NOTE", "RESOURCE", "TRACKER", "CATEGORY"]),
  searchQuery: "",
  selectedCategoryId: "",

  // UI state
  selectedNode: null,
  linkCreatorOpen: false,
  linkCreatorSource: null,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategoryId: (catId) => set({ selectedCategoryId: catId }),

  toggleFilter: (entityType) => {
    set((state) => {
      const next = new Set(state.activeFilters);
      if (next.has(entityType)) {
        next.delete(entityType);
      } else {
        next.add(entityType);
      }
      return { activeFilters: next };
    });
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  openLinkCreator: (sourceNode = null) =>
    set({ linkCreatorOpen: true, linkCreatorSource: sourceNode }),
  closeLinkCreator: () =>
    set({ linkCreatorOpen: false, linkCreatorSource: null }),

  fetchGraph: async () => {
    set({ isLoading: true, error: null });
    try {
      const graphData = await knowledgeLinkApi.getFullGraph();
      const nodes = (graphData?.nodes || []).map((n) => ({
        id: n.id,
        type: "entityNode",
        data: { label: n.label, entityType: n.entityType },
        position: { x: 0, y: 0 }, // Will be set by layout
      }));

      const edges = (graphData?.edges || []).map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.relationType?.replace(/_/g, " "),
        type: "smoothstep",
        animated: e.relationType === "DEPENDS_ON" || e.relationType === "LEARNING_PATH",
        data: { relationType: e.relationType },
      }));

      set({ nodes, edges });
    } catch (err) {
      set({ error: err?.response?.data?.message || "Failed to load graph" });
    } finally {
      set({ isLoading: false });
    }
  },

  createLink: async (payload) => {
    set({ isLoading: true });
    try {
      await knowledgeLinkApi.create(payload);
      await get().fetchGraph();
    } catch (err) {
      set({ error: err?.response?.data?.message || "Failed to create link" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLink: async (linkId) => {
    set({ isLoading: true });
    try {
      await knowledgeLinkApi.delete(linkId);
      await get().fetchGraph();
    } catch (err) {
      set({ error: err?.response?.data?.message || "Failed to delete link" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Get filtered nodes/edges based on active filters
  getFilteredData: () => {
    const { nodes, edges, activeFilters, searchQuery, selectedCategoryId } = get();
    const query = searchQuery.toLowerCase().trim();

    // If a specific category filter is active, find all connected node IDs
    let categoryAllowedNodeIds = null;
    if (selectedCategoryId) {
      categoryAllowedNodeIds = new Set();
      categoryAllowedNodeIds.add(selectedCategoryId);

      edges.forEach((e) => {
        if (e.source === selectedCategoryId) categoryAllowedNodeIds.add(e.target);
        if (e.target === selectedCategoryId) categoryAllowedNodeIds.add(e.source);
      });
    }

    const filteredNodes = nodes.filter((n) => {
      const typeMatch = activeFilters.has(n.data.entityType);
      const searchMatch = !query || n.data.label?.toLowerCase().includes(query);
      const categoryMatch = !categoryAllowedNodeIds || categoryAllowedNodeIds.has(n.id);
      return typeMatch && searchMatch && categoryMatch;
    });

    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = edges.filter(
      (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );

    return { filteredNodes, filteredEdges };
  },
}));
