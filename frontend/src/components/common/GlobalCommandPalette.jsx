"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchStore } from "@/stores/search.store";
import { useTaskStore } from "@/stores/task.store";
import { useNoteStore } from "@/stores/note.store";
import { useResourceStore } from "@/stores/resource.store";
import { useTrackerStore } from "@/stores/tracker.store";
import { useCategoryStore } from "@/stores/category.store";
import {
  Search,
  X,
  CheckSquare,
  FileText,
  Bookmark,
  Activity,
  FolderTree,
  Plus,
  Clock,
  ArrowRight,
  Zap,
  Sparkles,
  Command,
} from "lucide-react";

export default function GlobalCommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
  } = useSearchStore();

  const { tasks } = useTaskStore();
  const { notes, setSelectedNote } = useNoteStore();
  const { resources, setSelectedResource } = useResourceStore();
  const { trackers, setSelectedTracker } = useTrackerStore();
  const { categories } = useCategoryStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Combined real search results across all stores
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const matchedTasks = tasks
      .filter((t) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
      .slice(0, 4)
      .map((t) => ({
        id: `task-${t.id}`,
        title: t.title,
        type: "Task",
        subtitle: t.status || "TASK",
        icon: CheckSquare,
        color: "text-emerald-400",
        action: () => {
          router.push(`/tasks`);
        },
      }));

    const matchedNotes = notes
      .filter((n) => n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q))
      .slice(0, 4)
      .map((n) => ({
        id: `note-${n.id}`,
        title: n.title,
        type: "Note",
        subtitle: n.categoryName || "Wiki Document",
        icon: FileText,
        color: "text-[#8b5cf6]",
        action: () => {
          setSelectedNote(n);
          router.push(`/notes`);
        },
      }));

    const matchedResources = resources
      .filter((r) => r.title?.toLowerCase().includes(q) || r.url?.toLowerCase().includes(q))
      .slice(0, 4)
      .map((r) => ({
        id: `res-${r.id}`,
        title: r.title,
        type: "Resource",
        subtitle: r.resourceType || "LINK",
        icon: Bookmark,
        color: "text-cyan-400",
        action: () => {
          setSelectedResource(r);
          router.push(`/resources`);
        },
      }));

    const matchedTrackers = trackers
      .filter((tr) => tr.title?.toLowerCase().includes(q) || tr.description?.toLowerCase().includes(q))
      .slice(0, 4)
      .map((tr) => ({
        id: `tr-${tr.id}`,
        title: tr.title,
        type: "Tracker",
        subtitle: `${tr.progress || 0}% Complete`,
        icon: Activity,
        color: "text-amber-400",
        action: () => {
          setSelectedTracker(tr);
          router.push(`/trackers`);
        },
      }));

    const matchedCategories = categories
      .filter((c) => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        id: `cat-${c.id}`,
        title: c.name,
        type: "Category",
        subtitle: "Workspace Node",
        icon: FolderTree,
        color: "text-purple-400",
        action: () => {
          router.push(`/categories`);
        },
      }));

    return [
      ...matchedTasks,
      ...matchedNotes,
      ...matchedResources,
      ...matchedTrackers,
      ...matchedCategories,
    ];
  }, [query, tasks, notes, resources, trackers, categories, router, setSelectedNote, setSelectedResource, setSelectedTracker]);

  // Quick Action Shortcuts when query is empty
  const quickActions = useMemo(
    () => [
      {
        id: "act-new-task",
        title: "Create New Task",
        type: "Action",
        subtitle: "Add task to board",
        icon: Plus,
        color: "text-emerald-400",
        action: () => router.push("/tasks"),
      },
      {
        id: "act-new-note",
        title: "Write New Knowledge Note",
        type: "Action",
        subtitle: "Open Obsidian Markdown Editor",
        icon: FileText,
        color: "text-[#8b5cf6]",
        action: () => router.push("/notes"),
      },
      {
        id: "act-trackers",
        title: "Open Tracker Hub",
        type: "Action",
        subtitle: "View progress rings & timelines",
        icon: Activity,
        color: "text-amber-400",
        action: () => router.push("/trackers"),
      },
      {
        id: "act-activity",
        title: "View Activity Feed",
        type: "Action",
        subtitle: "GitHub style event log",
        icon: Clock,
        color: "text-cyan-400",
        action: () => router.push("/activity"),
      },
    ],
    [router]
  );

  const activeList = query.trim() ? searchResults : quickActions;

  // Keyboard navigation handler
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeCommandPalette();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (activeList.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + activeList.length) % (activeList.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeList[selectedIndex]) {
          if (query.trim()) addRecentSearch(query.trim());
          activeList[selectedIndex].action();
          closeCommandPalette();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, activeList, selectedIndex, query, addRecentSearch, closeCommandPalette]);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeCommandPalette}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
          />

          {/* Centered Command Palette Window */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-16 sm:pt-24 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden font-mono text-left flex flex-col"
            >
              {/* Command Palette Search Input Bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
                <Search className="h-5 w-5 text-[var(--primary)] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Type a command or search tasks, notes, trackers..."
                  className="flex-1 bg-transparent text-sm text-[var(--text)] focus:outline-none placeholder:text-[var(--text-muted)]"
                />
                {query ? (
                  <button onClick={() => setQuery("")} className="text-[var(--text-muted)] hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] font-bold">
                    ESC
                  </span>
                )}
              </div>

              {/* Recent Searches Strip (if query is empty) */}
              {!query && recentSearches.length > 0 && (
                <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-2 overflow-x-auto custom-scrollbar">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] shrink-0 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[var(--primary)]" /> Recent:
                  </span>
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="group flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] text-[var(--text)] hover:border-[var(--primary)] transition-all shrink-0"
                    >
                      <span>{term}</span>
                      <X
                        className="h-3 w-3 text-[var(--text-muted)] hover:text-rose-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(term);
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results / Quick Actions List */}
              <div className="max-h-[380px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                {activeList.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (query.trim()) addRecentSearch(query.trim());
                        item.action();
                        closeCommandPalette();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[var(--primary)]/20 border border-[var(--primary)]/50 text-white"
                          : "border border-transparent text-[var(--text-muted)] hover:text-white hover:bg-[var(--card)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] ${item.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-[var(--text)] truncate">{item.title}</p>
                          <p className="text-[10px] text-[var(--text-muted)] truncate">{item.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded bg-[var(--card)] border border-[var(--border)] px-2 py-0.5 text-[9px] font-bold text-[var(--primary)] uppercase">
                          {item.type}
                        </span>
                        {isSelected && <ArrowRight className="h-3.5 w-3.5 text-[var(--primary)]" />}
                      </div>
                    </div>
                  );
                })}

                {query.trim() && searchResults.length === 0 && (
                  <div className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
                    <Sparkles className="h-8 w-8 text-[var(--primary)] opacity-40 mx-auto animate-pulse" />
                    <p className="font-bold text-[var(--text)]">No matching results for "{query}"</p>
                    <p className="text-[10px]">Try searching tasks, notes, trackers, resources or categories.</p>
                  </div>
                )}
              </div>

              {/* Command Palette Footer Keyboard Legend */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] bg-[var(--card)] text-[10px] text-[var(--text-muted)]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-1 py-0.5 font-bold">↑↓</span> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-bold">↵</span> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-bold">ESC</span> Close
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold">
                  <Command className="h-3.5 w-3.5" /> Vega OS Command Palette
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
