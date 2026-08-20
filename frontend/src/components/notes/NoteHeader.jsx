"use client";

import { useEffect } from "react";
import { useNoteStore } from "@/stores/note.store";
import {
  FolderTree,
  BookOpen,
  Search,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  Star,
  Maximize2,
  Minimize2,
  Command,
} from "lucide-react";

export default function NoteHeader({ onOpenCommandPalette }) {
  const {
    filters,
    setFilters,
    viewMode,
    setViewMode,
    openDrawer,
    focusMode,
    toggleFocusMode,
    openCategorySidebar,
  } = useNoteStore();

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (onOpenCommandPalette) onOpenCommandPalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenCommandPalette]);

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-[var(--primary)] animate-pulse" /> Knowledge Vault & Notes
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Obsidian vault + Notion workspace + Personal Wiki.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <Command className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="rounded bg-[var(--card)] px-1.5 py-0.5 text-[9px] border border-[var(--border)]">
              Ctrl+K
            </kbd>
          </button>

          {/* New Note Button */}
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" /> New Note
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[280px]">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Filter notes by title or content..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
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

          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setFilters({ isFavorite: !filters.isFavorite })}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              filters.isFavorite
                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${filters.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
            Favorites
          </button>
        </div>

        {/* View Switcher & Focus Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFocusMode}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              focusMode
                ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
            title="Toggle Distraction-Free Focus Mode"
          >
            {focusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Focus</span>
          </button>

          <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--primary)] text-white font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
              title="Grid View"
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
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("workspace")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "workspace"
                  ? "bg-[var(--primary)] text-white font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
              title="Knowledge Workspace View"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
