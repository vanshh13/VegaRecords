"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "@/stores/category.store";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  Plus,
  Search,
  Maximize2,
  Minimize2,
  Code,
  Cpu,
  Zap,
  Tv,
  Sparkles,
  Briefcase,
  Book,
  Film,
  Heart,
  Coffee,
  Globe,
  Database,
  Layers,
  Terminal,
} from "lucide-react";

// Icon mapping helper
export const ICON_MAP = {
  Code,
  Cpu,
  Zap,
  Tv,
  Sparkles,
  Briefcase,
  Book,
  Film,
  Heart,
  Coffee,
  Globe,
  Database,
  Layers,
  Terminal,
  Folder,
};

export default function CategoryTreeExplorer() {
  const {
    categories,
    selectedCategoryId,
    expandedNodeIds,
    searchTerm,
    selectCategory,
    toggleNodeExpand,
    expandAll,
    collapseAll,
    setSearchTerm,
    openCreateDrawer,
  } = useCategoryStore();

  // Helper to build recursive tree structure
  const treeNodes = useMemo(() => {
    const getParentId = (cat) => cat.parentCategoryId || cat.parentId || null;

    const buildTree = (parentId = null) => {
      return categories
        .filter((cat) => getParentId(cat) === parentId)
        .map((cat) => ({
          ...cat,
          children: buildTree(cat.id),
        }));
    };

    const fullTree = buildTree(null);

    // If search filter is active, filter matching categories
    if (!searchTerm.trim()) return fullTree;

    const filterTree = (nodes) => {
      return nodes.reduce((acc, node) => {
        const matchesSelf = node.name.toLowerCase().includes(searchTerm.toLowerCase());
        const filteredChildren = filterTree(node.children);
        if (matchesSelf || filteredChildren.length > 0) {
          acc.push({ ...node, children: filteredChildren });
        }
        return acc;
      }, []);
    };

    return filterTree(fullTree);
  }, [categories, searchTerm]);

  // Auto expand nodes when searching
  const isSearchActive = Boolean(searchTerm.trim());

  // Count total visible categories after search filter
  const countVisibleNodes = (nodes) => {
    return nodes.reduce((acc, n) => acc + 1 + countVisibleNodes(n.children || []), 0);
  };
  const visibleCount = useMemo(() => countVisibleNodes(treeNodes), [treeNodes]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm font-mono overflow-hidden">
      {/* Header & Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-[var(--primary)] shrink-0" />
          <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider truncate">
            Category Explorer
          </h2>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={expandAll}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
            title="Expand All Nodes"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
          <button
            onClick={collapseAll}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
            title="Collapse All Nodes"
          >
            <Minimize2 className="h-3 w-3" />
          </button>
          <button
            onClick={() => openCreateDrawer(null)}
            className="flex h-7 px-2.5 items-center gap-1 rounded-lg bg-[var(--primary)] text-white text-[11px] font-bold shadow-md hover:opacity-90 transition-opacity"
            title="Create Root Category"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Quick Search Field with Clear Button & Counter */}
      <div className="space-y-1.5 my-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-8 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--primary)]/20 transition-colors text-[10px] font-bold"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Status Summary */}
        <div className="flex items-center justify-between px-1 text-[10px] text-[var(--text-muted)]">
          {isSearchActive ? (
            <span className="text-[var(--primary)] font-bold">
              Showing {visibleCount} matching category{visibleCount !== 1 ? "ies" : ""}
            </span>
          ) : (
            <span>Total Categories: {categories.length}</span>
          )}
          {isSearchActive && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-[var(--primary)] hover:underline font-bold"
            >
              Reset Search
            </button>
          )}
        </div>
      </div>

      {/* Tree View List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {treeNodes.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-muted)] space-y-2">
            <p>No categories found{isSearchActive ? ` matching "${searchTerm}"` : ""}.</p>
            {isSearchActive && (
              <button
                onClick={() => setSearchTerm("")}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-bold text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          treeNodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              selectedId={selectedCategoryId}
              expandedIds={expandedNodeIds}
              isSearchActive={isSearchActive}
              searchTerm={searchTerm}
              onSelect={selectCategory}
              onToggleExpand={toggleNodeExpand}
              onAddChild={(parentId) => openCreateDrawer(parentId)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TreeNode({
  node,
  level,
  selectedId,
  expandedIds,
  isSearchActive,
  searchTerm,
  onSelect,
  onToggleExpand,
  onAddChild,
}) {
  const isExpanded = isSearchActive || expandedIds.includes(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const IconComp = ICON_MAP[node.icon] || Folder;

  // Highlight search term in name
  const renderHighlightedName = (name) => {
    if (!searchTerm || !searchTerm.trim()) return name;
    const query = searchTerm.trim().toLowerCase();
    const idx = name.toLowerCase().indexOf(query);
    if (idx === -1) return name;

    const before = name.substring(0, idx);
    const match = name.substring(idx, idx + query.length);
    const after = name.substring(idx + query.length);

    return (
      <>
        {before}
        <mark className="bg-[var(--primary)]/30 text-[var(--primary)] rounded px-0.5 font-bold">
          {match}
        </mark>
        {after}
      </>
    );
  };

  return (
    <div className="select-none">
      <div
        onClick={() => onSelect(node.id)}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        className={`group flex items-center justify-between rounded-xl py-2 pr-2 text-xs font-mono transition-all cursor-pointer ${
          isSelected
            ? "bg-[var(--primary)]/15 text-[var(--text)] font-bold border border-[var(--primary)]/30 shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)]"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Arrow Expand Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded transition-transform ${
              hasChildren ? "opacity-100 hover:text-[var(--primary)]" : "opacity-0"
            } ${isExpanded ? "rotate-90" : ""}`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          {/* Icon indicator with theme color */}
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `${node.color || "#6366f1"}20`, color: node.color || "#6366f1" }}
          >
            <IconComp className="h-3.5 w-3.5" />
          </span>

          {/* Name */}
          <span className="truncate">{renderHighlightedName(node.name)}</span>
        </div>

        {/* Hover Actions & Items Count */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-[var(--text-muted)] font-mono opacity-80">
            {node.itemsCount || 0}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(node.id);
            }}
            className="hidden group-hover:flex h-5 w-5 items-center justify-center rounded bg-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
            title="Add Child Category"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Recursive Children Nodes */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-l border-[var(--border)] ml-5 my-0.5"
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedId={selectedId}
                expandedIds={expandedIds}
                isSearchActive={isSearchActive}
                searchTerm={searchTerm}
                onSelect={onSelect}
                onToggleExpand={onToggleExpand}
                onAddChild={onAddChild}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
