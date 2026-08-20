"use client";

import { useEffect, useState, useMemo } from "react";
import { useCategoryStore } from "@/stores/category.store";
import { useResourceStore } from "@/stores/resource.store";
import { FolderTree, Tag, Layers, CheckCircle2, Search } from "lucide-react";

export default function ResourceCategoryFilter() {
  const { categories, fetchCategories } = useCategoryStore();
  const { filters, setFilters } = useResourceStore();
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

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono shadow-sm space-y-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-[var(--primary)]" /> Categories
        </h3>

        {activeCategoryId && (
          <button
            onClick={() => setFilters({ categoryId: null })}
            className="text-[10px] text-[var(--primary)] font-bold hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Category Search Box */}
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

      {/* All Categories Pill */}
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
          <span>All Resources</span>
        </div>
        {activeCategoryId === null && <CheckCircle2 className="h-3.5 w-3.5" />}
      </button>

      {/* Category Tree List */}
      <div className="space-y-1.5 pt-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {filteredCategories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters({ categoryId: cat.id })}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "border border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)] shadow-sm"
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

              {cat.isSystem && (
                <span className="rounded bg-[var(--primary)]/10 px-1 py-0.2 text-[8px] font-bold text-[var(--primary)] uppercase border border-[var(--primary)]/20">
                  SYS
                </span>
              )}
            </button>
          );
        })}

        {filteredCategories.length === 0 && (
          <p className="text-[11px] text-[var(--text-muted)] p-2 text-center">
            No matching categories found.
          </p>
        )}
      </div>
    </div>
  );
}
