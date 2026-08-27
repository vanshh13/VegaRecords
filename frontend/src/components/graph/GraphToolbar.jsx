"use client";

import {
  Search,
  CheckSquare,
  FileText,
  Bookmark,
  Activity,
  FolderTree,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useKnowledgeGraphStore } from "@/stores/knowledgeGraph.store";

const FILTER_TYPES = [
  { type: "TASK", icon: CheckSquare, label: "Tasks" },
  { type: "NOTE", icon: FileText, label: "Notes" },
  { type: "RESOURCE", icon: Bookmark, label: "Resources" },
  { type: "TRACKER", icon: Activity, label: "Trackers" },
  { type: "CATEGORY", icon: FolderTree, label: "Categories" },
];

export default function GraphToolbar({
  onRefresh,
  onToggleCategorySidebar,
  isCategorySidebarOpen,
}) {
  const {
    nodes,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    activeFilters,
    toggleFilter,
    openLinkCreator,
  } = useKnowledgeGraphStore();

  return (
    <div className="graph-toolbar">
      {/* Search */}
      <div className="graph-toolbar__search">
        <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Sidebar Button (Right Beside Search Input) */}
      {onToggleCategorySidebar && (
        <button
          onClick={onToggleCategorySidebar}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            isCategorySidebarOpen || selectedCategoryId
              ? "border-[#ec4899] bg-[#ec4899]/15 text-[var(--text)] shadow-sm"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#ec4899]/50"
          }`}
          title="Toggle Category Filter Sidebar"
        >
          <FolderTree size={13} className="text-[#ec4899]" />
          <span>Category Sidebar</span>
          {selectedCategoryId && (
            <span className="h-2 w-2 rounded-full bg-[#ec4899] animate-pulse" />
          )}
        </button>
      )}


      {/* Entity Type Filters */}
      <div className="graph-toolbar__filters">
        {FILTER_TYPES.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            data-type={type}
            className={`graph-toolbar__filter-btn ${activeFilters.has(type) ? "active" : ""}`}
            onClick={() => toggleFilter(type)}
            title={`Toggle ${label}`}
          >
            <Icon size={12} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="graph-toolbar__actions">
        <button
          className="graph-toolbar__action-btn"
          onClick={() => openLinkCreator()}
          title="Create new link"
        >
          <Plus size={13} />
          <span className="hidden sm:inline">Link</span>
        </button>
        <button
          className="graph-toolbar__action-btn"
          onClick={onRefresh}
          title="Refresh graph"
          style={{ background: "var(--hover-bg)", color: "var(--text)" }}
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </div>
  );
}


