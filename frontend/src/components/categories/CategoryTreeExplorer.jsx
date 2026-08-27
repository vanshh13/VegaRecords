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

  const isSearchActive = Boolean(searchTerm.trim());

  const countVisibleNodes = (nodes) => {
    return nodes.reduce((acc, n) => acc + 1 + countVisibleNodes(n.children || []), 0);
  };
  const visibleCount = useMemo(() => countVisibleNodes(treeNodes), [treeNodes]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm font-mono overflow-hidden">
      {/* Header & New Category Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-[var(--primary)] shrink-0" />
          <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider truncate">
            Category Explorer
          </h2>
        </div>

        <button
          onClick={() => openCreateDrawer(null)}
          className="flex h-7 px-2.5 items-center gap-1 rounded-lg bg-[var(--primary)] text-white text-[11px] font-bold shadow-md hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--primary)] shrink-0"
          title="Create Root Category"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Quick Search Field */}
      <div className="space-y-1.5 my-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            aria-label="Search categories by name"
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
              Found {visibleCount} node{visibleCount !== 1 ? "s" : ""}
            </span>
          ) : (
            <span>Total Nodes: {categories.length}</span>
          )}
          {isSearchActive && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-[var(--primary)] hover:underline font-bold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Tree View List */}
      <div
        className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar min-h-0"
        role="tree"
        aria-label="Category Hierarchy Tree"
      >
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSelect(node.id);
    } else if (e.key === "ArrowRight" && hasChildren && !isExpanded) {
      onToggleExpand(node.id);
    } else if (e.key === "ArrowLeft" && hasChildren && isExpanded) {
      onToggleExpand(node.id);
    }
  };

  return (
    <div className="select-none" role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
      <div
        onClick={() => onSelect(node.id)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        className={`group flex items-center justify-between rounded-xl py-2 pr-2 text-xs font-mono transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
          isSelected
            ? "bg-[var(--primary)]/15 text-[var(--text)] font-bold border border-[var(--primary)]/30 shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)]"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          {/* Arrow Expand Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            aria-label={isExpanded ? "Collapse category" : "Expand category"}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-transform ${
              hasChildren ? "opacity-100 hover:text-[var(--primary)]" : "opacity-0 pointer-events-none"
            } ${isExpanded ? "rotate-90" : ""}`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          {/* Icon indicator with theme color */}
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border shadow-xs"
            style={{
              backgroundColor: `${node.color || "#6366f1"}20`,
              borderColor: `${node.color || "#6366f1"}40`,
              color: node.color || "#6366f1",
            }}
          >
            <IconComp className="h-3.5 w-3.5" />
          </span>

          {/* Name */}
          <span className="truncate">{renderHighlightedName(node.name)}</span>
        </div>

        {/* Hover Actions & Items Count */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-[var(--text-muted)] font-mono opacity-80 bg-[var(--card)] px-1.5 py-0.5 rounded border border-[var(--border)]">
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
            aria-label="Add Child Category"
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
