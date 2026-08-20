"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { useTaskStore } from "@/stores/task.store";
import { useNoteStore } from "@/stores/note.store";
import { useResourceStore } from "@/stores/resource.store";
import { useTrackerStore } from "@/stores/tracker.store";
import { useCategoryStore } from "@/stores/category.store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  CheckSquare,
  FileText,
  Bookmark,
  Activity,
  FolderTree,
  X,
  Filter,
  ArrowUpRight,
  Sparkles,
  Layers,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState("ALL"); // ALL | TASK | NOTE | RESOURCE | TRACKER | CATEGORY

  const { tasks } = useTaskStore();
  const { notes, setSelectedNote } = useNoteStore();
  const { resources, setSelectedResource } = useResourceStore();
  const { trackers, setSelectedTracker } = useTrackerStore();
  const { categories } = useCategoryStore();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Combined search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const matchedTasks = tasks
      .filter((t) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
      .map((t) => ({
        id: `task-${t.id}`,
        title: t.title,
        description: t.description || "Task item in board",
        type: "TASK",
        category: t.categoryName || "General",
        icon: CheckSquare,
        color: "text-emerald-400",
        action: () => router.push("/tasks"),
      }));

    const matchedNotes = notes
      .filter((n) => n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q))
      .map((n) => ({
        id: `note-${n.id}`,
        title: n.title,
        description: n.content ? n.content.replace(/<[^>]*>?/gm, "").slice(0, 140) + "..." : "Knowledge Note",
        type: "NOTE",
        category: n.categoryName || "Wiki",
        icon: FileText,
        color: "text-[#8b5cf6]",
        action: () => {
          setSelectedNote(n);
          router.push("/notes");
        },
      }));

    const matchedResources = resources
      .filter((r) => r.title?.toLowerCase().includes(q) || r.url?.toLowerCase().includes(q))
      .map((r) => ({
        id: `res-${r.id}`,
        title: r.title,
        description: r.url || "Bookmarked Vault Resource",
        type: "RESOURCE",
        category: r.resourceType || "URL",
        icon: Bookmark,
        color: "text-cyan-400",
        action: () => {
          setSelectedResource(r);
          router.push("/resources");
        },
      }));

    const matchedTrackers = trackers
      .filter((tr) => tr.title?.toLowerCase().includes(q) || tr.description?.toLowerCase().includes(q))
      .map((tr) => ({
        id: `tr-${tr.id}`,
        title: tr.title,
        description: tr.description || `Tracker running at ${tr.progress || 0}%`,
        type: "TRACKER",
        category: `${tr.progress || 0}% Progress`,
        icon: Activity,
        color: "text-amber-400",
        action: () => {
          setSelectedTracker(tr);
          router.push("/trackers");
        },
      }));

    const matchedCategories = categories
      .filter((c) => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
      .map((c) => ({
        id: `cat-${c.id}`,
        title: c.name,
        description: c.description || "Workspace Node Hierarchy",
        type: "CATEGORY",
        category: "System Root",
        icon: FolderTree,
        color: "text-purple-400",
        action: () => router.push("/categories"),
      }));

    return [
      ...matchedTasks,
      ...matchedNotes,
      ...matchedResources,
      ...matchedTrackers,
      ...matchedCategories,
    ];
  }, [query, tasks, notes, resources, trackers, categories, router, setSelectedNote, setSelectedResource, setSelectedTracker]);

  const filteredResults = useMemo(() => {
    if (filter === "ALL") return searchResults;
    return searchResults.filter((item) => item.type === filter);
  }, [searchResults, filter]);

  return (
    <MainLayout>
      <div className="space-y-6 font-mono">
        {/* Header Banner */}
        <div className="space-y-4 border-b border-[var(--border)] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)]">
              <SearchIcon className="h-3.5 w-3.5" /> Workspace Index Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text)] tracking-tight">
              Global Unified Search
            </h1>
            <p className="text-xs text-[var(--text-muted)] max-w-xl font-sans">
              Instant real-time search across your tasks, notes, trackers, resources, and workspace category hierarchies.
            </p>
          </div>

          {/* Large Search Bar */}
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-[var(--primary)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all modules..."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-12 pr-10 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none shadow-xl font-mono"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-3.5 text-[var(--text-muted)] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        {query.trim() && (
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-xs text-[var(--text-muted)] font-bold flex items-center gap-1.5 mr-2 shrink-0">
              <Filter className="h-3.5 w-3.5 text-[var(--primary)]" /> Filter Results:
            </span>
            {[
              { label: `All (${searchResults.length})`, value: "ALL" },
              { label: "Tasks", value: "TASK" },
              { label: "Notes", value: "NOTE" },
              { label: "Resources", value: "RESOURCE" },
              { label: "Trackers", value: "TRACKER" },
              { label: "Categories", value: "CATEGORY" },
            ].map((item) => {
              const isActive = filter === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--text)] shadow-md"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Results List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  onClick={item.action}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg backdrop-blur-xl hover:border-[var(--primary)]/40 hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] ${item.color} shrink-0 mt-0.5`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors truncate">
                          {item.title}
                        </h3>
                        <span className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[9px] font-bold text-[var(--primary)] uppercase shrink-0">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--card)] px-2.5 py-1 rounded-xl border border-[var(--border)]">
                      {item.category}
                    </span>
                    <button className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] group-hover:border-[var(--primary)]/40 transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {query.trim() && filteredResults.length === 0 && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-3">
              <Sparkles className="h-10 w-10 text-[var(--primary)] opacity-40 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-[var(--text)]">No Search Results Found</h3>
              <p className="text-xs text-[var(--text-muted)] font-sans max-w-sm mx-auto">
                No entries match your search query "{query}". Try checking another keyword or filter tab.
              </p>
            </div>
          )}

          {!query.trim() && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-3">
              <Layers className="h-10 w-10 text-[var(--primary)] opacity-40 mx-auto" />
              <h3 className="text-sm font-bold text-[var(--text)]">Type to Search Workspace</h3>
              <p className="text-xs text-[var(--text-muted)] font-sans max-w-sm mx-auto">
                Enter keywords above or press <span className="font-mono text-[var(--primary)] font-bold">⌘K</span> anytime to open the instant Command Palette.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">Loading workspace search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
