"use client";

import { useEffect, useState, useMemo } from "react";
import { useCategoryStore } from "@/stores/category.store";
import { useNoteStore } from "@/stores/note.store";
import { FolderTree, Tag, Layers, CheckCircle2, Star, Clock, FileText, Search } from "lucide-react";

export default function NoteSidebar() {
  const { categories, fetchCategories } = useCategoryStore();
  const { filters, setFilters, notes, setSelectedNote, selectedNote } = useNoteStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const activeCategoryId = filters.categoryId;

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const q = searchTerm.toLowerCase().trim();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
    );
  }, [categories, searchTerm]);

  // Recent 5 notes
  const recentNotes = notes.slice(0, 5);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono shadow-sm space-y-4 overflow-y-auto custom-scrollbar">
      {/* Category Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-[var(--primary)]" /> Categories
          </h3>
          {activeCategoryId && (
            <button
              onClick={() => setFilters({ categoryId: null })}
              className="text-[10px] text-[var(--primary)] font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Search Field */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-1.5 pl-8 pr-7 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-2 text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* All Notes Button */}
        <button
          onClick={() => setFilters({ categoryId: null })}
          className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
            activeCategoryId === null
              ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-sm"
              : "border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40"
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            <span>All Notes</span>
          </div>
          {activeCategoryId === null && <CheckCircle2 className="h-3.5 w-3.5" />}
        </button>

        {/* Category List */}
        <div className="space-y-1">
          {filteredCategories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilters({ categoryId: cat.id })}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "border border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]"
                    : "border border-transparent hover:border-[var(--border)] hover:bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || "#6366f1" }}
                  />
                  <span className="truncate text-xs">{cat.name}</span>
                </div>
              </button>
            );
          })}

          {filteredCategories.length === 0 && (
            <p className="text-[11px] text-[var(--text-muted)] p-2 text-center">
              No matching categories.
            </p>
          )}
        </div>
      </div>

      {/* Quick Recent Notes */}
      <div className="space-y-2 pt-3 border-t border-[var(--border)]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[var(--primary)]" /> Recent Notes
        </h3>

        <div className="space-y-1">
          {recentNotes.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNote(n)}
              className={`w-full text-left rounded-xl p-2 text-xs transition-colors truncate block ${
                selectedNote?.id === n.id
                  ? "bg-[var(--primary)]/10 font-bold text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
              }`}
            >
              <div className="truncate font-bold text-xs">{n.title}</div>
              <div className="text-[10px] opacity-70 truncate">{n.categoryName || "Uncategorized"}</div>
            </button>
          ))}

          {recentNotes.length === 0 && (
            <p className="text-[11px] text-[var(--text-muted)] p-2">No recent notes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
