"use client";

import { useEffect, useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CategoryTreeExplorer from "@/components/categories/CategoryTreeExplorer";
import CategoryWorkspace from "@/components/categories/CategoryWorkspace";
import CategoryDetailsPanel from "@/components/categories/CategoryDetailsPanel";
import CategoryCardGrid from "@/components/categories/CategoryCardGrid";
import CategoryDrawer from "@/components/categories/CategoryDrawer";
import CategorySkeleton from "@/components/categories/CategorySkeleton";
import { useCategoryStore } from "@/stores/category.store";
import "@/components/categories/categories.css";
import {
  FolderTree,
  Plus,
  Layers,
  Globe,
  Activity,
  FolderOpen,
  Info,
  LayoutGrid,
  ListTree,
} from "lucide-react";

export default function CategoriesPage() {
  const { categories, fetchCategories, openCreateDrawer, isLoading, isInspectorOpen, toggleInspector } =
    useCategoryStore();

  const [viewMode, setViewMode] = useState("tree"); // 'tree' | 'grid'
  const [mobileTab, setMobileTab] = useState("workspace"); // 'tree' | 'workspace' | 'inspector'

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Compute stat metrics
  const stats = useMemo(() => {
    const total = categories.length;
    const system = categories.filter((c) => c.isSystem).length;
    const userCreated = total - system;
    const totalItems = categories.reduce((acc, c) => acc + (c.itemsCount || 0), 0);
    return { total, system, userCreated, totalItems };
  }, [categories]);

  return (
    <MainLayout>
      <div className="category-workspace-root flex flex-col space-y-4 font-mono min-h-0">
        {/* Workspace Page Header */}
        <div className="task-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="task-page-header-left">
            <div className="task-page-icon">
              <FolderTree className="h-5 w-5 text-[#8b5cf6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="task-page-title">Category Hierarchy Workspace</h1>
                <span className="task-page-header-badge">
                  <span className="task-status-dot" />
                  TREE V2.5
                </span>
              </div>
              <p className="task-page-subtitle">
                Interactive Notion-style knowledge hierarchy explorer, node inspector & card grid.
              </p>
            </div>
          </div>

          {/* Header Action Toolbar & View Mode Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "tree"
                    ? "bg-[#8b5cf6] text-white shadow-md"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                title="Tree & Workspace View"
              >
                <ListTree className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Tree Explorer</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-[#8b5cf6] text-white shadow-md"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                title="Visual Cards Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Card Grid</span>
              </button>
            </div>

            <button
              onClick={() => openCreateDrawer(null)}
              className="task-new-btn flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> New Category
            </button>
          </div>
        </div>

        {/* Tactical Stat Strip */}
        <div className="task-stats-strip">
          <div className="task-stat-card">
            <div className="task-stat-icon text-[#8b5cf6]">
              <Layers className="h-5 w-5" />
            </div>
            <div className="task-stat-content">
              <span className="task-stat-value text-white">{stats.total}</span>
              <span className="task-stat-label">Total Nodes</span>
              <span className="task-stat-sub">{stats.userCreated} custom created</span>
            </div>
          </div>

          <div className="task-stat-card">
            <div className="task-stat-icon text-cyan-400">
              <Globe className="h-5 w-5" />
            </div>
            <div className="task-stat-content">
              <span className="task-stat-value text-cyan-400">{stats.system}</span>
              <span className="task-stat-label">System Nodes</span>
              <span className="task-stat-sub">Core architecture</span>
            </div>
          </div>

          <div className="task-stat-card">
            <div className="task-stat-icon text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div className="task-stat-content">
              <span className="task-stat-value text-emerald-400">{stats.totalItems}</span>
              <span className="task-stat-label">Linked Entities</span>
              <span className="task-stat-sub">Across workspace</span>
            </div>
          </div>
        </div>

        {/* Content Section: Skeleton vs Active View */}
        {isLoading ? (
          <CategorySkeleton />
        ) : viewMode === "grid" ? (
          <CategoryCardGrid
            onSelectAndSwitchView={() => {
              setViewMode("tree");
              setMobileTab("workspace");
            }}
          />
        ) : (
          <div className="flex flex-col space-y-3 flex-1 min-h-0">
            {/* Mobile / Tablet Tab Switcher (< lg screens) */}
            <div className="flex lg:hidden items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1.5 gap-1">
              <button
                onClick={() => setMobileTab("tree")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === "tree"
                    ? "bg-[#8b5cf6] text-white shadow-md"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5" /> Explorer Tree
              </button>
              <button
                onClick={() => setMobileTab("workspace")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === "workspace"
                    ? "bg-[#8b5cf6] text-white shadow-md"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Layers className="h-3.5 w-3.5" /> Workspace
              </button>
              <button
                onClick={() => {
                  setMobileTab("inspector");
                  if (!isInspectorOpen) toggleInspector();
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === "inspector"
                    ? "bg-[#8b5cf6] text-white shadow-md"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Info className="h-3.5 w-3.5" /> Inspector
              </button>
            </div>

            {/* Responsive Workspace Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 lg:h-[calc(100vh-17rem)]">
              {/* Left Column: Category Tree Explorer (3 or 4 cols) */}
              <div
                className={`${
                  mobileTab === "tree" ? "block" : "hidden lg:block"
                } ${isInspectorOpen ? "lg:col-span-3" : "lg:col-span-4"} h-[550px] lg:h-full overflow-hidden transition-all duration-300`}
              >
                <CategoryTreeExplorer />
              </div>

              {/* Center Column: Category Main Workspace (6 or 8 cols) */}
              <div
                className={`${
                  mobileTab === "workspace" ? "block" : "hidden lg:block"
                } ${isInspectorOpen ? "lg:col-span-6" : "lg:col-span-8"} h-[550px] lg:h-full overflow-hidden transition-all duration-300`}
              >
                <CategoryWorkspace />
              </div>

              {/* Right Column: Node Inspector & Details Panel (Shown only when isInspectorOpen is true) */}
              {isInspectorOpen && (
                <div
                  className={`${
                    mobileTab === "inspector" ? "block" : "hidden lg:block"
                  } lg:col-span-3 h-[550px] lg:h-full overflow-hidden transition-all duration-300`}
                >
                  <CategoryDetailsPanel />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Creation / Editing Slide-over Drawer */}
      <CategoryDrawer />
    </MainLayout>
  );
}
