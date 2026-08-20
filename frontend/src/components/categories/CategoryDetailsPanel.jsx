"use client";

import { useMemo } from "react";
import { useCategoryStore } from "@/stores/category.store";
import { useAuthStore } from "@/stores/auth.store";
import { ICON_MAP } from "./CategoryTreeExplorer";
import {
  Folder,
  Info,
  Calendar,
  Layers,
  Activity,
  Edit2,
  Trash2,
  Database,
  Globe,
  User,
  Shield,
} from "lucide-react";

export default function CategoryDetailsPanel() {
  const { categories, selectedCategoryId, openEditDrawer, deleteCategory } = useCategoryStore();
  const { user } = useAuthStore();

  const userRole = (typeof user?.role === "string" ? user.role : user?.role?.roleName)?.toUpperCase() || "";
  const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

  const getParentId = (cat) => (cat ? cat.parentCategoryId || cat.parentId || null : null);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  const parentCategory = useMemo(() => {
    const pId = getParentId(activeCategory);
    if (!activeCategory || !pId) return null;
    return categories.find((c) => c.id === pId);
  }, [categories, activeCategory]);

  if (!activeCategory) return null;

  const IconComp = ICON_MAP[activeCategory.icon] || Folder;

  return (
    <div className="flex h-full flex-col space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm overflow-y-auto custom-scrollbar">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider">
            Node Inspector
          </h2>
        </div>
        <span
          className="h-3 w-3 rounded-full border border-white/20 shadow-sm"
          style={{ backgroundColor: activeCategory.color || "#6366f1" }}
        />
      </div>

      {/* Main Node Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl border"
              style={{
                backgroundColor: `${activeCategory.color || "#6366f1"}20`,
                borderColor: `${activeCategory.color || "#6366f1"}40`,
                color: activeCategory.color || "#6366f1",
              }}
            >
              <IconComp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--text)] font-mono">{activeCategory.name}</h3>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">ID: {activeCategory.id}</span>
            </div>
          </div>

          {activeCategory.isSystem ? (
            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase bg-[var(--primary)]/15 border border-[var(--primary)]/40 text-[var(--primary)] font-mono flex items-center gap-1">
              <Globe className="h-2.5 w-2.5" /> SYSTEM
            </span>
          ) : (
            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase bg-amber-500/15 border border-amber-500/40 text-amber-400 font-mono flex items-center gap-1">
              <User className="h-2.5 w-2.5" /> USER
            </span>
          )}
        </div>

        <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
          {activeCategory.description || "No specific details provided for this node."}
        </p>
      </div>

      {/* Metadata Statistics */}
      <div className="space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <span className="text-[var(--text-muted)] flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-[var(--primary)]" /> Parent Node
          </span>
          <span className="font-bold text-[var(--text)]">
            {parentCategory ? parentCategory.name : "ROOT CATEGORY"}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <span className="text-[var(--text-muted)] flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-emerald-400" /> Child Nodes
          </span>
          <span className="font-bold text-[var(--text)]">
            {categories.filter((c) => getParentId(c) === activeCategory.id).length} Direct
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <span className="text-[var(--text-muted)] flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-amber-400" /> Total Items
          </span>
          <span className="font-bold text-[var(--text)]">{activeCategory.itemsCount || 0} Linked</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <span className="text-[var(--text-muted)] flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-cyan-400" /> Created Date
          </span>
          <span className="font-bold text-[var(--text)]">
            {activeCategory.createdAt ? new Date(activeCategory.createdAt).toLocaleDateString() : "AUG 2026"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          disabled={activeCategory.isSystem && !isAdmin}
          onClick={() => {
            if (activeCategory.isSystem && !isAdmin) {
              alert("System categories cannot be modified by user role. Only admin can modify system categories.");
              return;
            }
            openEditDrawer(activeCategory);
          }}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 text-xs font-mono font-bold transition-colors ${
            activeCategory.isSystem && !isAdmin
              ? "opacity-40 cursor-not-allowed text-[var(--text-muted)]"
              : "text-[var(--text)] hover:border-[var(--primary)]/40"
          }`}
          title={activeCategory.isSystem && !isAdmin ? "System category - Only admin can edit" : "Modify Node Metadata"}
        >
          <Edit2 className="h-3.5 w-3.5 text-[var(--primary)]" /> Modify Node Metadata
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
          className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-mono font-bold transition-colors ${
            activeCategory.isSystem && !isAdmin
              ? "opacity-40 cursor-not-allowed border-gray-500/20 text-gray-500"
              : "border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          }`}
          title={activeCategory.isSystem && !isAdmin ? "System category - Only admin can remove" : "Remove Category"}
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove Category
        </button>
      </div>
    </div>
  );
}
