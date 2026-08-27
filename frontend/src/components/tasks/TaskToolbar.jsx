"use client";

import { useTaskStore } from "@/stores/task.store";
import { useCategoryStore } from "@/stores/category.store";
import { useState } from "react";

const ViewIcon = ({ id }) => {
  if (id === "list")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    );
  if (id === "board")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="11" rx="1" />
      </svg>
    );
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  );
};

export default function TaskToolbar() {
  const {
    viewMode,
    setViewMode,
    filters,
    setFilter,
    resetFilters,
    openCreateDrawer,
    openCategorySidebar,
  } = useTaskStore();
  const { categories } = useCategoryStore();
  const [searchFocused, setSearchFocused] = useState(false);

  const isFiltered =
    filters.status !== "ALL" ||
    filters.priority !== "ALL" ||
    filters.categoryId !== "ALL" ||
    filters.search.trim() !== "";

  const activeCategory = categories.find((c) => c.id === filters.categoryId);

  const VIEWS = [
    { id: "list", label: "List" },
    { id: "board", label: "Board" },
    { id: "timeline", label: "Timeline" },
  ];

  const PRIORITY_OPTIONS = [
    { value: "ALL", label: "All Priority" },
    { value: "URGENT", label: "⚡ Urgent" },
    { value: "HIGH", label: "🔴 High" },
    { value: "MEDIUM", label: "🟡 Medium" },
    { value: "LOW", label: "⚪ Low" },
  ];

  const STATUS_OPTIONS = [
    { value: "ALL", label: "All Status" },
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  return (
    <div className="task-toolbar">
      {/* Left: View Switcher */}
      <div className="task-view-switcher">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setViewMode(v.id)}
            className={`task-view-btn${viewMode === v.id ? " active" : ""}`}
            title={v.label}
          >
            <ViewIcon id={v.id} />
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      {/* Center: Search */}
      <div className={`task-toolbar-search${searchFocused ? " focused" : ""}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="task-toolbar-search-icon">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search missions..."
          className="task-toolbar-search-input"
        />
        {filters.search && (
          <button
            onClick={() => setFilter("search", "")}
            className="task-toolbar-search-clear"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>

      {/* Right: Filters + Actions */}
      <div className="task-toolbar-right">
        {/* Category Filter Button */}
        <button
          onClick={openCategorySidebar}
          className={`task-filter-btn${activeCategory ? " active" : ""}`}
          title="Filter by Category"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span className="task-filter-btn-label">
            {activeCategory ? activeCategory.name : "Categories"}
          </span>
          {activeCategory && (
            <span
              className="task-filter-dot"
              style={{ backgroundColor: activeCategory.color || "var(--primary)" }}
            />
          )}
        </button>

        {/* Priority Select */}
        <select
          value={filters.priority}
          onChange={(e) => setFilter("priority", e.target.value)}
          className="task-filter-select"
        >
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-[var(--surface)] text-[var(--text)]">
              {o.label}
            </option>
          ))}
        </select>

        {/* Status Select */}
        <select
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
          className="task-filter-select"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-[var(--surface)] text-[var(--text)]">
              {o.label}
            </option>
          ))}
        </select>

        {/* Reset */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="task-reset-btn"
            title="Clear all filters"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.07" />
            </svg>
          </button>
        )}

        {/* New Task CTA */}
        <button
          onClick={() => openCreateDrawer()}
          className="task-new-btn"
          id="task-create-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
}
