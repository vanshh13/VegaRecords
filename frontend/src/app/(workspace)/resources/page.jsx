"use client";

import { useEffect, useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useResourceStore } from "@/stores/resource.store";
import ResourceHeader from "@/components/resources/ResourceHeader";
import ResourceCategorySidebar from "@/components/resources/ResourceCategorySidebar";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceCompactList from "@/components/resources/ResourceCompactList";
import ResourceKnowledgeWall from "@/components/resources/ResourceKnowledgeWall";
import ResourceDrawer from "@/components/resources/ResourceDrawer";
import ResourceDetailsPanel from "@/components/resources/ResourceDetailsPanel";
import { Bookmark, RefreshCw, Star, Info, Code2, Plus } from "lucide-react";

export default function ResourcesPage() {
  const { resources, isLoading, fetchResources, viewMode, openDrawer } = useResourceStore();

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Compute stat metrics
  const stats = useMemo(() => {
    const total = resources.length;
    const favorites = resources.filter((r) => r.isFavorite).length;
    const githubRepos = resources.filter((r) => r.resourceType === "GITHUB").length;
    return { total, favorites, githubRepos };
  }, [resources]);

  return (
    <MainLayout>
      <div className="task-workspace-root flex flex-col space-y-4 font-mono min-h-0">
        {/* Top Header */}
        <ResourceHeader />

        {/* Tactical Stat Strip */}
        <div className="task-stats-strip">
          <div className="task-stat-card">
            <div className="task-stat-icon text-[#8b5cf6]">
              <Bookmark className="h-5 w-5" />
            </div>
            <div className="task-stat-content">
              <span className="task-stat-value text-white">{stats.total}</span>
              <span className="task-stat-label">Saved Resources</span>
              <span className="task-stat-sub">Total vault items</span>
            </div>
          </div>

          <div className="task-stat-card">
            <div className="task-stat-icon text-amber-400">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <div className="task-stat-content">
              <span className="task-stat-value text-amber-400">{stats.favorites}</span>
              <span className="task-stat-label">Starred Favorites</span>
              <span className="task-stat-sub">Quick access</span>
            </div>
          </div>

          <div className="task-stat-card">
            <div className="task-stat-icon text-cyan-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="task-stat-content">
              <span className="task-stat-value text-cyan-400">{stats.githubRepos}</span>
              <span className="task-stat-label">Code Repos</span>
              <span className="task-stat-sub">GitHub & GitLab</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Workspace Layout: Center Content (8 cols) | Right Inspector Panel (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 lg:h-[calc(100vh-18rem)]">
          {/* Main Resource Workspace (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[550px] lg:h-full overflow-y-auto custom-scrollbar rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-xs font-bold text-[var(--text-muted)] gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[var(--primary)]" /> Loading resources...
              </div>
            ) : resources.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full my-auto p-8 text-center space-y-4">
                <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                  <Bookmark className="h-8 w-8 text-[#8b5cf6]" />
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">No Resources Found</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm font-sans leading-relaxed">
                  Save external links, GitHub repos, articles, or videos to build your personal knowledge vault.
                </p>
                <button
                  onClick={() => openDrawer()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Resource
                </button>
              </div>
            ) : (
              <>
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {resources.map((res) => (
                      <ResourceCard key={res.id} resource={res} />
                    ))}
                  </div>
                )}

                {viewMode === "list" && <ResourceCompactList resources={resources} />}

                {viewMode === "wall" && <ResourceKnowledgeWall resources={resources} />}
              </>
            )}
          </div>

          {/* Right Panel: Resource Details Inspector (4 cols) */}
          <div className="lg:col-span-4 h-[450px] lg:h-full overflow-hidden">
            <ResourceDetailsPanel />
          </div>
        </div>

        {/* Right Slide-over Category Sidebar */}
        <ResourceCategorySidebar />

        {/* Slide-over Drawer for Create / Edit */}
        <ResourceDrawer />
      </div>
    </MainLayout>
  );
}
