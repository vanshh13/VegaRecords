"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderTree,
  X,
  Search,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useKnowledgeGraphStore } from "@/stores/knowledgeGraph.store";

export default function CategoryRightSidebar({ isOpen, onClose }) {
  const {
    nodes,
    edges,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useKnowledgeGraphStore();

  const [categorySearch, setCategorySearch] = useState("");

  // Extract category nodes from the graph
  const categoryNodes = useMemo(() => {
    return nodes.filter((n) => n.data?.entityType === "CATEGORY");
  }, [nodes]);

  // Compute connected node counts for each category
  const categoryCounts = useMemo(() => {
    const counts = {};
    categoryNodes.forEach((cat) => {
      let count = 0;
      edges.forEach((e) => {
        if (e.source === cat.id || e.target === cat.id) count++;
      });
      counts[cat.id] = count;
    });
    return counts;
  }, [categoryNodes, edges]);

  // Filter categories by search input
  const filteredCategories = useMemo(() => {
    const query = categorySearch.toLowerCase().trim();
    if (!query) return categoryNodes;
    return categoryNodes.filter((c) =>
      c.data?.label?.toLowerCase().includes(query)
    );
  }, [categoryNodes, categorySearch]);

  const activeCategoryNode = useMemo(() => {
    return categoryNodes.find((c) => c.id === selectedCategoryId);
  }, [categoryNodes, selectedCategoryId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay for outside click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30"
          />

          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-80 border-l border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md flex flex-col justify-between h-full z-40 font-mono shadow-2xl shrink-0"
          >

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--card)]/50">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-[#ec4899]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text)]">
                Category Sidebar
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {/* Category Search Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                Search Categories
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Type category name..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-3 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[#ec4899] focus:outline-none"
                />
              </div>
            </div>

            {/* Current Active Category Focus Banner */}
            {activeCategoryNode ? (
              <div className="p-3 rounded-2xl border border-[#ec4899]/50 bg-[#ec4899]/10 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-lg">📁</span>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase text-[#ec4899]">
                      Active Category Focus
                    </span>
                    <h4 className="text-xs font-bold text-[var(--text)] truncate">
                      {activeCategoryNode.data?.label}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategoryId("")}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]/40 flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)]">
                <Sparkles className="h-4 w-4 text-[#ec4899] shrink-0" />
                <span>Showing Full Knowledge Graph</span>
              </div>
            )}

            {/* Category Input / Selection List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#ec4899]" /> Select Category
                </label>
                <span className="text-[10px] font-bold text-[#ec4899]">
                  {categoryNodes.length} Available
                </span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
                {/* All Categories Pill */}
                <button
                  onClick={() => setSelectedCategoryId("")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    !selectedCategoryId
                      ? "border-[#ec4899] bg-[#ec4899]/20 text-[var(--text)] shadow-sm"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#ec4899]/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-[#ec4899] text-white">
                      <FolderTree className="h-3.5 w-3.5" />
                    </span>
                    <span>All Categories</span>
                  </div>
                  {!selectedCategoryId && <Check className="h-4 w-4 text-[#ec4899]" />}
                </button>

                {/* Individual Categories */}
                {filteredCategories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  const connCount = categoryCounts[cat.id] || 0;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(isSelected ? "" : cat.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "border-[#ec4899] bg-[#ec4899]/20 text-[var(--text)] shadow-sm"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#ec4899]/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base shrink-0">📁</span>
                        <span className="truncate">{cat.data?.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
                          {connCount} links
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#ec4899]" />}
                      </div>
                    </button>
                  );
                })}

                {filteredCategories.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] p-3 text-center">
                    No matching categories found.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Management CTA */}
          <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]">
            <Link
              href="/categories"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] py-2.5 text-xs font-bold text-[var(--text)] hover:border-[#ec4899] transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#ec4899]" /> Manage Category Tree
            </Link>
          </div>
        </motion.aside>
      </>
      )}
    </AnimatePresence>
  );
}

