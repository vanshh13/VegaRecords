"use client";

import { useResourceStore } from "@/stores/resource.store";
import {
  FolderTree,
  Bookmark,
  Search,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  Star,
  Filter,
  Video,
  Code2,
  FileText,
  Globe,
  BookOpen,
  GraduationCap,
} from "lucide-react";

const RESOURCE_TYPES = [
  { value: "", label: "All Types" },
  { value: "YOUTUBE", label: "YouTube", icon: Video },
  { value: "GITHUB", label: "GitHub", icon: Code2 },
  { value: "DOCUMENTATION", label: "Docs", icon: FileText },
  { value: "ARTICLE", label: "Article", icon: BookOpen },
  { value: "BLOG", label: "Blog", icon: FileText },
  { value: "COURSE", label: "Course", icon: GraduationCap },
  { value: "WEBSITE", label: "Website", icon: Globe },
];

export default function ResourceHeader() {
  const { filters, setFilters, viewMode, setViewMode, openDrawer, openCategorySidebar } = useResourceStore();

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* Page Title & primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] flex items-center gap-2.5">
            <Bookmark className="h-6 w-6 text-[var(--primary)] animate-pulse" /> Resource Vault
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Notion-style links, Arc spaces, & Obsidian knowledge bookmarks.
          </p>
        </div>

        <button
          onClick={() => openDrawer()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Resource
        </button>
      </div>

      {/* Control Bar: Search, Type Filter, Favorites, View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search resources by title, url, notes..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          {/* Resource Type Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5">
            <Filter className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
            <select
              value={filters.resourceType || ""}
              onChange={(e) => setFilters({ resourceType: e.target.value || null })}
              className="bg-transparent text-xs text-[var(--text)] focus:outline-none font-bold cursor-pointer"
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[var(--surface)] text-[var(--text)]">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Categories Sidebar Button */}
          <button
            onClick={openCategorySidebar}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              filters.categoryId
                ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <FolderTree className="h-3.5 w-3.5 text-[#8b5cf6]" />
            Categories
            {filters.categoryId && (
              <span className="rounded bg-[#8b5cf6] px-1.5 py-0.2 text-[9px] text-white">1</span>
            )}
          </button>

          {/* Favorite Toggle Filter */}
          <button
            onClick={() => setFilters({ isFavorite: !filters.isFavorite })}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              filters.isFavorite
                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${filters.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
            Favorites Only
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === "grid"
                ? "bg-[var(--primary)] text-white font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === "list"
                ? "bg-[var(--primary)] text-white font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
            title="Compact List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("wall")}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === "wall"
                ? "bg-[var(--primary)] text-white font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
            title="Knowledge Wall View"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
