"use client";

import { useMemo } from "react";
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
  ShieldAlert,
} from "lucide-react";

export default function CategoryWorkspace() {
  const { categories, selectedCategoryId, selectCategory, openCreateDrawer, openEditDrawer, deleteCategory } =
    useCategoryStore();

  const { user } = useAuthStore();
  const userRole = (typeof user?.role === "string" ? user.role : user?.role?.roleName)?.toUpperCase() || "";
  const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

  const getParentId = (cat) => (cat ? cat.parentCategoryId || cat.parentId || null : null);

  // Find active selected category
  const activeCategory = useMemo(() => {
    return categories.find((cat) => cat.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  // Compute breadcrumbs path
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
    <div className="flex h-full flex-col space-y-6 overflow-y-auto pr-1 custom-scrollbar">
      {/* Category Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
        {/* Accent Glow Background */}
        <div
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: activeCategory.color || "#6366f1" }}
        />

        <div className="relative z-10 space-y-4">
          {/* Breadcrumbs Path */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
            <span>Root</span>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.id} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                <span
                  onClick={() => selectCategory(crumb.id)}
                  className={`hover:text-[var(--primary)] cursor-pointer ${
                    crumb.id === activeCategory.id ? "text-[var(--text)] font-bold" : ""
                  }`}
                >
                  {crumb.name}
                </span>
              </div>
            ))}
          </div>

          {/* Main Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg"
                style={{
                  backgroundColor: `${activeCategory.color || "#6366f1"}25`,
                  borderColor: `${activeCategory.color || "#6366f1"}50`,
                  color: activeCategory.color || "#6366f1",
                }}
              >
                <IconComp className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-[var(--text)] font-mono tracking-tight">
                    {activeCategory.name}
                  </h1>
                  {activeCategory.isSystem ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[var(--primary)]/40 bg-[var(--primary)]/15 px-2 py-0.5 text-[9px] font-bold uppercase text-[var(--primary)] font-mono">
                      <Globe className="h-2.5 w-2.5" /> SYSTEM CATEGORY
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-400 font-mono">
                      <User className="h-2.5 w-2.5" /> USER CATEGORY
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5 max-w-xl leading-relaxed">
                  {activeCategory.description || "No category description provided."}
                </p>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => openCreateDrawer(activeCategory.id)}
                className="flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3.5 py-2 text-xs font-mono font-bold text-white shadow-md hover:opacity-90 transition-opacity"
              >
                <FolderPlus className="h-3.5 w-3.5" /> Sub-Category
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
                title={activeCategory.isSystem && !isAdmin ? "System category - Only admin can edit" : "Edit Category"}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                disabled={activeCategory.isSystem && !isAdmin}
                onClick={async () => {
                  if (activeCategory.isSystem && !isAdmin) {
                    alert("System category can't be removed by user role. Only admin can remove category with isSystem set to true.");
                    return;
                  }
                  if (confirm(`Are you sure you want to delete category "${activeCategory.name}"?`)) {
                    const res = await deleteCategory(activeCategory.id);
                    if (res && res.error) {
                      alert(res.error);
                    }
                  }
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors ${
                  activeCategory.isSystem && !isAdmin
                    ? "opacity-40 cursor-not-allowed text-gray-500"
                    : "text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30"
                }`}
                title={activeCategory.isSystem && !isAdmin ? "System category - Only admin can remove" : "Delete Category"}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Categories Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-[var(--primary)]" />
            Sub-Categories ({childCategories.length})
          </h2>
          <button
            onClick={() => openCreateDrawer(activeCategory.id)}
            className="text-[11px] font-mono text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Add Child Node
          </button>
        </div>

        {childCategories.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center space-y-2">
            <p className="text-xs font-mono text-[var(--text-muted)]">No sub-categories created under this node.</p>
            <button
              onClick={() => openCreateDrawer(activeCategory.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-[var(--primary)]" /> Create Sub-Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {childCategories.map((child) => {
              const ChildIcon = ICON_MAP[child.icon] || Folder;
              return (
                <div
                  key={child.id}
                  onClick={() => selectCategory(child.id)}
                  className="group cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm hover:border-[var(--primary)]/50 hover:shadow-lg transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border"
                      style={{
                        backgroundColor: `${child.color || "#6366f1"}20`,
                        borderColor: `${child.color || "#6366f1"}40`,
                        color: child.color || "#6366f1",
                      }}
                    >
                      <ChildIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text)] font-mono group-hover:text-[var(--primary)] transition-colors">
                        {child.name}
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono line-clamp-1">
                        {child.description || "Sub-category node"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Connected Workspace Items Grid */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--secondary)]" />
          Associated Entities & Trackers
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
              <span>Tasks</span>
              <CheckSquare className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <p className="text-lg font-extrabold text-[var(--text)] font-mono">4 Linked</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
              <span>Trackers</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-lg font-extrabold text-[var(--text)] font-mono">2 Active</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
              <span>Notes</span>
              <FileText className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-lg font-extrabold text-[var(--text)] font-mono">7 Notes</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
              <span>Bookmarks</span>
              <Bookmark className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-lg font-extrabold text-[var(--text)] font-mono">5 Saved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
