"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  CheckSquare,
  FileText,
  Bookmark,
  Activity,
  FolderTree,
  X,
  ExternalLink,
  Plus,
  GitFork,
  Layers,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useKnowledgeGraphStore } from "@/stores/knowledgeGraph.store";

const ENTITY_CONFIG = {
  TASK: { label: "Tasks", icon: CheckSquare, color: "#3b82f6", route: "/tasks" },
  NOTE: { label: "Notes", icon: FileText, color: "#10b981", route: "/notes" },
  RESOURCE: { label: "Resources", icon: Bookmark, color: "#f59e0b", route: "/resources" },
  TRACKER: { label: "Trackers", icon: Activity, color: "#a855f7", route: "/trackers" },
  CATEGORY: { label: "Categories", icon: FolderTree, color: "#ec4899", route: "/categories" },
};

const RELATION_TYPES = [
  { type: "PART_OF", label: "Part Of", color: "#10b981" },
  { type: "RELATED_TO", label: "Related To", color: "#6366f1" },
  { type: "DEPENDS_ON", label: "Depends On", color: "#ef4444" },
  { type: "REFERENCES", label: "References", color: "#f59e0b" },
  { type: "LEARNING_PATH", label: "Learning Path", color: "#a855f7" },
];

export default function GraphRightSidebar({ isOpen, onClose }) {
  const {
    nodes,
    edges,
    activeFilters,
    toggleFilter,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedNode,
    setSelectedNode,
    openLinkCreator,
  } = useKnowledgeGraphStore();

  // Extract category nodes for the Category Filter dropdown
  const categoryNodes = useMemo(() => {
    return nodes.filter((n) => n.data?.entityType === "CATEGORY");
  }, [nodes]);

  // Compute counts by entity type
  const typeCounts = useMemo(() => {
    const counts = { TASK: 0, NOTE: 0, RESOURCE: 0, TRACKER: 0, CATEGORY: 0 };
    nodes.forEach((n) => {
      const type = n.data?.entityType;
      if (counts[type] !== undefined) counts[type]++;
    });
    return counts;
  }, [nodes]);


  // Find connected links for the selected node
  const connectedLinks = useMemo(() => {
    if (!selectedNode) return [];
    const nodeId = selectedNode.id;
    return edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .map((e) => {
        const isSource = e.source === nodeId;
        const otherId = isSource ? e.target : e.source;
        const otherNode = nodes.find((n) => n.id === otherId);
        return {
          edgeId: e.id,
          relationType: e.data?.relationType || "RELATED_TO",
          direction: isSource ? "outgoing" : "incoming",
          otherNode,
        };
      })
      .filter((item) => item.otherNode);
  }, [selectedNode, edges, nodes]);

  const selectedEntityConfig = selectedNode
    ? ENTITY_CONFIG[selectedNode.data?.entityType] || ENTITY_CONFIG.TASK
    : null;

  const SelectedIcon = selectedEntityConfig ? selectedEntityConfig.icon : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="w-80 border-l border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md flex flex-col justify-between h-full z-20 font-mono shadow-2xl shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--card)]/50">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-[#ec4899]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text)]">
                Category & Entity Filters
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                Search Canvas
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Filter nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-3 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>

            {/* Interactive Category Filter Sidebar Panel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <FolderTree className="h-3.5 w-3.5 text-[#ec4899]" /> Category Filters
                </label>
                {selectedCategoryId && (
                  <button
                    onClick={() => setSelectedCategoryId("")}
                    className="text-[10px] text-[var(--primary)] hover:underline font-bold"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar">
                {/* All Categories Option */}
                <button
                  onClick={() => setSelectedCategoryId("")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    !selectedCategoryId
                      ? "border-[#ec4899]/50 bg-[#ec4899]/15 text-[var(--text)] shadow-sm"
                      : "border-transparent bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-[#ec4899] text-white">
                      <FolderTree className="h-3.5 w-3.5" />
                    </span>
                    <span>All Categories</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-mono">Full Graph</span>
                </button>

                {/* Individual Categories */}
                {categoryNodes.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(isSelected ? "" : cat.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "border-[#ec4899]/60 bg-[#ec4899]/20 text-[var(--text)] shadow-sm"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base shrink-0">📁</span>
                        <span className="truncate">{cat.data?.label}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-[#ec4899] text-white">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>



            {/* Entity Type Filter Toggles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[var(--primary)]" /> Entity Type Filters
                </label>
                <span className="text-[10px] font-bold text-[var(--primary)]">
                  {activeFilters.size}/{Object.keys(ENTITY_CONFIG).length}
                </span>
              </div>

              <div className="space-y-1.5">
                {Object.entries(ENTITY_CONFIG).map(([type, cfg]) => {
                  const Icon = cfg.icon;
                  const isActive = activeFilters.has(type);
                  const count = typeCounts[type] || 0;

                  return (
                    <button
                      key={type}
                      onClick={() => toggleFilter(type)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isActive
                          ? "border-[var(--primary)]/40 bg-[var(--card)] text-[var(--text)] shadow-sm"
                          : "border-transparent bg-[var(--surface)] text-[var(--text-muted)] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="p-1.5 rounded-lg text-white shadow-sm"
                          style={{ backgroundColor: cfg.color }}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span>{cfg.label}</span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{
                          backgroundColor: isActive ? `${cfg.color}20` : "var(--card)",
                          color: isActive ? cfg.color : "var(--text-muted)",
                          border: `1px solid ${isActive ? cfg.color : "var(--border)"}`,
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>



            {/* Relation Types Legend */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                Relation Legend
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {RELATION_TYPES.map((rel) => (
                  <div
                    key={rel.type}
                    className="flex items-center justify-between p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[11px] font-bold"
                  >
                    <span className="text-[var(--text)]">{rel.label}</span>
                    <span
                      className="h-2.5 w-6 rounded-full"
                      style={{ backgroundColor: rel.color }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]">
            <button
              onClick={() => openLinkCreator()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 transition-all"
            >
              <Plus className="h-4 w-4" /> Create New Relation Link
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
