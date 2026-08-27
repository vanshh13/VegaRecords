"use client";

import { useEffect } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import { useCategoryStore } from "@/stores/category.store";
import {
    Activity,
    Search,
    Plus,
    LayoutGrid,
    List,
    Sparkles,
    Star,
    Filter,
    Layers,
    Folder,
    FolderTree,
} from "lucide-react";
import Link from "next/link";

const TRACKER_STATUSES = [
    { value: "", label: "All Statuses" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "PAUSED", label: "Paused" },
    { value: "DROPPED", label: "Dropped" },
    { value: "PLAN_TO_WATCH", label: "Plan to Track" },
];

export default function TrackerHeader({ onOpenWizard }) {
    const { filters, setFilters, viewMode, setViewMode, openDrawer, openCategorySidebar } = useTrackerStore();
    const { trackerTypes } = useTrackerTypeStore();
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="flex flex-col gap-4 font-mono">
            {/* Title & CTA bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] flex items-center gap-2.5">
                        <Activity className="h-6 w-6 text-[var(--primary)] animate-pulse" /> Tracker System Hub
                    </h1>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <Link
                        href="/tracker-types"
                        className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shrink-0"
                    >
                        <Layers className="h-4 w-4 text-[var(--primary)]" /> Custom Types
                    </Link>

                    <button
                        onClick={onOpenWizard}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-all shrink-0"
                    >
                        <Plus className="h-4 w-4" /> Create Tracker
                    </button>
                </div>
            </div>

            {/* Controls Bar: Search, Categories Sidebar, Type Filter, Status Filter, Favorites, View Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
                <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[280px]">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search movies, anime, books, courses..."
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                        />
                    </div>

                    {/* Categories Sidebar Button */}
                    <button
                        onClick={openCategorySidebar}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${filters.categoryId
                            ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]"
                            : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                            }`}
                    >
                        <FolderTree className="h-3.5 w-3.5 text-[#8b5cf6]" />
                        Categories
                        {filters.categoryId && (
                            <span className="rounded bg-[#8b5cf6] px-1.5 py-0.2 text-[9px] text-white font-black">1</span>
                        )}
                    </button>

                    {/* Tracker Type Selector */}
                    {trackerTypes && trackerTypes.length > 0 && (
                        <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5">
                            <Layers className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
                            <select
                                value={filters.trackerTypeId || ""}
                                onChange={(e) => setFilters({ trackerTypeId: e.target.value || null })}
                                className="bg-transparent text-xs text-[var(--text)] focus:outline-none font-bold cursor-pointer"
                            >
                                <option value="" className="bg-[var(--surface)] text-[var(--text)]">
                                    All Types
                                </option>
                                {trackerTypes.map((t) => (
                                    <option key={t.id} value={t.id} className="bg-[var(--surface)] text-[var(--text)]">
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Status Filter Selector */}
                    <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5">
                        <Filter className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
                        <select
                            value={filters.status || ""}
                            onChange={(e) => setFilters({ status: e.target.value || null })}
                            className="bg-transparent text-xs text-[var(--text)] focus:outline-none font-bold cursor-pointer"
                        >
                            {TRACKER_STATUSES.map((s) => (
                                <option key={s.value} value={s.value} className="bg-[var(--surface)] text-[var(--text)]">
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Favorite Filter Toggle */}
                    <button
                        onClick={() => setFilters({ isFavorite: !filters.isFavorite })}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${filters.isFavorite
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
                        className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === "grid"
                            ? "bg-[var(--primary)] text-white font-bold"
                            : "text-[var(--text-muted)] hover:text-[var(--text)]"
                            }`}
                        title="Card Grid View"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("library")}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === "library"
                            ? "bg-[var(--primary)] text-white font-bold"
                            : "text-[var(--text-muted)] hover:text-[var(--text)]"
                            }`}
                        title="Library Poster View"
                    >
                        <Sparkles className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("progress")}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === "progress"
                            ? "bg-[var(--primary)] text-white font-bold"
                            : "text-[var(--text-muted)] hover:text-[var(--text)]"
                            }`}
                        title="Progress Matrix View"
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
