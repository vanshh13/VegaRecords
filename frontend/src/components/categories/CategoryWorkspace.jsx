"use client";

import { useMemo, useState } from "react";
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
  FolderPlus,
  Layers,
  CheckSquare,
  FileText,
  Activity,
  Bookmark,
  Sparkles,
  Globe,
  User,
  Info,
} from "lucide-react";

export default function CategoryWorkspace() {
  const {
    categories,
    selectedCategoryId,
    selectCategory,
    openCreateDrawer,
    openEditDrawer,
    deleteCategory,
    isInspectorOpen,
    toggleInspector,
  } = useCategoryStore();

  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("children"); // 'children' | 'entities'

  const userRole = (typeof user?.role === "string" ? user.role : user?.role?.roleName)?.toUpperCase() || "";
  const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

  const getParentId = (cat) => (cat ? cat.parentCategoryId || cat.parentId || null : null);

  // Active selected category
  const activeCategory = useMemo(() => {
    return categories.find((cat) => cat.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  // Breadcrumbs path
  const breadcrumbs = useMemo(() => {
    if (!activeCategory) return [];
    const chain = [];
    let current = activeCategory;
    while (current) {
      chain.unshift(current);
      const parentId = getParentId(current);
      current = parentId ? categories.find((c) => c.id === parentId) : null;
    }
    return chain;
  }, [categories, activeCategory]);

  // Child categories
  const childCategories = useMemo(() => {
    if (!activeCategory) return [];
    return categories.filter((cat) => getParentId(cat) === activeCategory.id);
  }, [categories, activeCategory]);

  if (!activeCategory) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center font-mono text-xs text-[var(--text-muted)]">
        No category selected.
      </div>
    );
  }

  const IconComp = ICON_MAP[activeCategory.icon] || Folder;

  return (
    <div className="flex flex-col h-full space-y-5 overflow-y-auto pr-1 custom-scrollbar font-mono">
      {/* Main Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7 shadow-md">
        {/* Accent Glow Background */}
        <div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: activeCategory.color || "#6366f1" }}
        />

        <div className="relative z-10 space-y-4">
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] flex-wrap">
            <span
              onClick={() => selectCategory(null)}
              className="hover:text-[var(--primary)] cursor-pointer transition-colors"
            >
              Root
            </span>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.id} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-[var(--text-muted)] opacity-60" />
                <span
                  onClick={() => selectCategory(crumb.id)}
                  className={`hover:text-[var(--primary)] cursor-pointer transition-colors ${
                    crumb.id === activeCategory.id ? "text-[var(--text)] font-bold" : ""
                  }`}
                >
                  {crumb.name}
                </span>
              </div>
            ))}
          </nav>

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-lg transition-all"
                style={{
                  backgroundColor: `${activeCategory.color || "#6366f1"}25`,
                  borderColor: `${activeCategory.color || "#6366f1"}50`,
                  color: activeCategory.color || "#6366f1",
                }}
              >
                <IconComp className="h-7 w-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] tracking-tight">
                    {activeCategory.name}
                  </h1>
                  {activeCategory.isSystem ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[var(--primary)]/40 bg-[var(--primary)]/15 px-2 py-0.5 text-[9px] font-bold uppercase text-[var(--primary)]">
                      <Globe className="h-2.5 w-2.5" /> SYSTEM CATEGORY
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-400">
                      <User className="h-2.5 w-2.5" /> USER CATEGORY
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xl leading-relaxed">
                  {activeCategory.description || "No specific details provided for this node."}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {/* Node Inspector Toggle Button */}
              <button
                onClick={toggleInspector}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                  isInspectorOpen
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40"
                }`}
                title={isInspectorOpen ? "Hide Node Inspector" : "Show Node Inspector"}
              >
                <Info className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Inspector</span>
              </button>

              <button
                onClick={() => openCreateDrawer(activeCategory.id)}
                className="flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3.5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity"
              >
                <FolderPlus className="h-3.5 w-3.5" /> Sub-Node
              </button>

              <button
                disabled={activeCategory.isSystem && !isAdmin}
                onClick={() => {
                  if (activeCategory.isSystem && !isAdmin) {
                    alert("System categories cannot be modified by user role. Only admin can modify system categories.");
                    return;
                  }
                  openEditDrawer(activeCategory);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors ${
                  activeCategory.isSystem && !isAdmin
                    ? "opacity-40 cursor-not-allowed text-[var(--text-muted)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40"
                }`}
                title={activeCategory.isSystem && !isAdmin ? "Only Admin can edit system category" : "Edit Category"}
              >
                <Edit2 className="h-4 w-4" />
              </button>

              <button
                disabled={activeCategory.isSystem && !isAdmin}
                onClick={async () => {
                  if (activeCategory.isSystem && !isAdmin) {
                    alert("System categories cannot be deleted by user role. Only admin can delete system categories.");
                    return;
                  }
                  if (confirm(`Are you sure you want to delete category "${activeCategory.name}"?`)) {
                    const res = await deleteCategory(activeCategory.id);
                    if (res && res.error) alert(res.error);
                  }
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors ${
                  activeCategory.isSystem && !isAdmin
                    ? "opacity-40 cursor-not-allowed text-gray-500"
                    : "text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30"
                }`}
                title={activeCategory.isSystem && !isAdmin ? "Only Admin can delete system category" : "Delete Category"}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher for Workspace Content */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab("children")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "children"
              ? "bg-[var(--surface)] text-[var(--primary)] border border-[var(--border)] shadow-xs"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Sub-Categories ({childCategories.length})
        </button>
        <button
          onClick={() => setActiveTab("entities")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "entities"
              ? "bg-[var(--surface)] text-[var(--primary)] border border-[var(--border)] shadow-xs"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          Linked Items ({activeCategory.itemsCount || 0})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "children" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
              Child Categories
            </h2>
            <button
              onClick={() => openCreateDrawer(activeCategory.id)}
              className="text-[11px] text-[var(--primary)] hover:underline flex items-center gap-1 font-bold"
            >
              <Plus className="h-3 w-3" /> Add Child Category
            </button>
          </div>

          {childCategories.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-3">
              <p className="text-xs text-[var(--text-muted)]">No child categories created under "{activeCategory.name}".</p>
              <button
                onClick={() => openCreateDrawer(activeCategory.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-[var(--primary)]" /> Add Sub-Category Node
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {childCategories.map((child) => {
                const ChildIcon = ICON_MAP[child.icon] || Folder;
                return (
                  <div
                    key={child.id}
                    onClick={() => selectCategory(child.id)}
                    className="group cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm hover:border-[var(--primary)]/50 hover:shadow-lg transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                        style={{
                          backgroundColor: `${child.color || "#6366f1"}20`,
                          borderColor: `${child.color || "#6366f1"}40`,
                          color: child.color || "#6366f1",
                        }}
                      >
                        <ChildIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors truncate">
                          {child.name}
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">
                          {child.description || "Sub-category node"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "entities" && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
            Workspace Linked Entities
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Tasks</span>
                <CheckSquare className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <p className="text-xl font-extrabold text-[var(--text)]">4 Tasks</p>
              <span className="text-[10px] text-emerald-400">2 Pending</span>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Trackers</span>
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-xl font-extrabold text-[var(--text)]">2 Active</p>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Movies, Books</span>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Notes</span>
                <FileText className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="text-xl font-extrabold text-[var(--text)]">7 Notes</p>
              <span className="text-[10px] text-[var(--text-muted)]">Documentation</span>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Bookmarks</span>
                <Bookmark className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-xl font-extrabold text-[var(--text)]">5 Links</p>
              <span className="text-[10px] text-[var(--text-muted)]">Saved resources</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
