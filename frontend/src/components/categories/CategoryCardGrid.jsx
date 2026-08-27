"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "@/stores/category.store";
import { useAuthStore } from "@/stores/auth.store";
import { ICON_MAP } from "./CategoryTreeExplorer";
import {
  Folder,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Layers,
  Globe,
  User,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Activity,
  FolderOpen,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

export default function CategoryCardGrid({ onSelectAndSwitchView }) {
  const { categories, selectedCategoryId, selectCategory, openCreateDrawer, openEditDrawer, deleteCategory } =
    useCategoryStore();
  const { user } = useAuthStore();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'root' | 'system' | 'user'
  const [sortBy, setSortBy] = useState("name-asc"); // 'name-asc' | 'name-desc' | 'items-desc' | 'children-desc'

  const userRole = (typeof user?.role === "string" ? user.role : user?.role?.roleName)?.toUpperCase() || "";
  const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

  const getParentId = (cat) => cat?.parentCategoryId || cat?.parentId || null;

  // Filtered & Sorted Categories
  const processedCategories = useMemo(() => {
    let result = [...categories];

    // Filter by type
    if (filterType === "root") {
      result = result.filter((cat) => !getParentId(cat));
    } else if (filterType === "system") {
      result = result.filter((cat) => cat.isSystem);
    } else if (filterType === "user") {
      result = result.filter((cat) => !cat.isSystem);
    }

    // Search query filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (cat) =>
          cat.name.toLowerCase().includes(query) ||
          (cat.description && cat.description.toLowerCase().includes(query))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "items-desc") return (b.itemsCount || 0) - (a.itemsCount || 0);
      if (sortBy === "children-desc") {
        const childrenA = categories.filter((c) => getParentId(c) === a.id).length;
        const childrenB = categories.filter((c) => getParentId(c) === b.id).length;
        return childrenB - childrenA;
      }
      return 0;
    });

    return result;
  }, [categories, search, filterType, sortBy]);

  return (
    <div className="space-y-4 font-mono">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name or description..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-8 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-[10px]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {[
            { id: "all", label: "All Nodes" },
            { id: "root", label: "Root Only" },
            { id: "system", label: "System" },
            { id: "user", label: "Custom" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === tab.id
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "bg-[var(--card)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
          >
            <option value="name-asc" className="bg-[var(--surface)] text-[var(--text)]">Name (A-Z)</option>
            <option value="name-desc" className="bg-[var(--surface)] text-[var(--text)]">Name (Z-A)</option>
            <option value="items-desc" className="bg-[var(--surface)] text-[var(--text)]">Most Linked Items</option>
            <option value="children-desc" className="bg-[var(--surface)] text-[var(--text)]">Most Sub-categories</option>
          </select>
        </div>
      </div>

      {/* Grid Results Status */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
        <span>
          Showing <strong className="text-[var(--text)]">{processedCategories.length}</strong> of{" "}
          <strong className="text-[var(--text)]">{categories.length}</strong> categories
        </span>
        {(search || filterType !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setFilterType("all");
            }}
            className="text-[var(--primary)] hover:underline font-bold text-[11px]"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Categories Cards Grid */}
      {processedCategories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <FolderOpen className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">No categories found</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              No categories match your search or active filter settings. Try clearing your filters or create a new node.
            </p>
          </div>
          <button
            onClick={() => openCreateDrawer(null)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Create Category Node
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {processedCategories.map((category) => {
              const IconComp = ICON_MAP[category.icon] || Folder;
              const isSelected = selectedCategoryId === category.id;
              const parentId = getParentId(category);
              const parentCategory = parentId ? categories.find((c) => c.id === parentId) : null;
              const childCount = categories.filter((c) => getParentId(c) === category.id).length;

              return (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative flex flex-col justify-between rounded-2xl border bg-[var(--surface)] p-4 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                      : "border-[var(--border)] hover:border-[var(--primary)]/50"
                  }`}
                  onClick={() => selectCategory(category.id)}
                  tabIndex={0}
                  role="article"
                  aria-label={`Category ${category.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      selectCategory(category.id);
                    }
                  }}
                >
                  {/* Top Card Bar */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-md transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: `${category.color || "#6366f1"}20`,
                            borderColor: `${category.color || "#6366f1"}40`,
                            color: category.color || "#6366f1",
                          }}
                        >
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[var(--text)] truncate group-hover:text-[var(--primary)] transition-colors">
                            {category.name}
                          </h3>
                          {parentCategory && (
                            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 truncate">
                              <Layers className="h-2.5 w-2.5" /> in {parentCategory.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* System / User Tag */}
                      {category.isSystem ? (
                        <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase bg-[var(--primary)]/15 border border-[var(--primary)]/40 text-[var(--primary)] flex items-center gap-0.5">
                          <Globe className="h-2.5 w-2.5" /> SYS
                        </span>
                      ) : (
                        <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center gap-0.5">
                          <User className="h-2.5 w-2.5" /> USER
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed min-h-[2.25rem]">
                      {category.description || "No description provided for this category node."}
                    </p>
                  </div>

                  {/* Card Meta & Bottom Toolbar */}
                  <div className="pt-3 mt-3 border-t border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3 text-[var(--primary)]" />
                        <strong className="text-[var(--text)]">{childCount}</strong> sub-nodes
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-emerald-400" />
                        <strong className="text-[var(--text)]">{category.itemsCount || 0}</strong> linked
                      </span>
                    </div>

                    {/* Quick Action Toolbar */}
                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCategory(category.id);
                          if (onSelectAndSwitchView) onSelectAndSwitchView();
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
                        title="Explore in workspace view"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCreateDrawer(category.id);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                          title="Add child category"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={category.isSystem && !isAdmin}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (category.isSystem && !isAdmin) {
                              alert("System category - Only admin can edit.");
                              return;
                            }
                            openEditDrawer(category);
                          }}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] transition-colors ${
                            category.isSystem && !isAdmin
                              ? "opacity-30 cursor-not-allowed text-[var(--text-muted)]"
                              : "text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40"
                          }`}
                          title={category.isSystem && !isAdmin ? "Only Admin can edit" : "Edit category"}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={category.isSystem && !isAdmin}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (category.isSystem && !isAdmin) {
                              alert("System category - Only admin can delete.");
                              return;
                            }
                            if (confirm(`Delete category "${category.name}"?`)) {
                              const res = await deleteCategory(category.id);
                              if (res && res.error) alert(res.error);
                            }
                          }}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                            category.isSystem && !isAdmin
                              ? "opacity-30 cursor-not-allowed border-transparent text-[var(--text-muted)]"
                              : "border-[var(--border)] bg-[var(--card)] text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/30"
                          }`}
                          title={category.isSystem && !isAdmin ? "Only Admin can delete" : "Delete category"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
