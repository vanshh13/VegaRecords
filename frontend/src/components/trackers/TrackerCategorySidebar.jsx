"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "@/stores/category.store";
import { useTrackerStore } from "@/stores/tracker.store";
import {
  FolderTree,
  Search,
  X,
  Plus,
  Layers,
  Activity,
} from "lucide-react";

export default function TrackerCategorySidebar() {
  const { categories, fetchCategories, openCreateDrawer: openCategoryDrawer } = useCategoryStore();
  const { filters, setFilters, trackers, isCategorySidebarOpen, closeCategorySidebar } = useTrackerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const sidebarRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Click outside & Escape key listener
  useEffect(() => {
    if (!isCategorySidebarOpen) return;

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeCategorySidebar();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCategorySidebar();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCategorySidebarOpen, closeCategorySidebar]);

  const activeCategoryId = filters.categoryId;

  // Count trackers per category
  const trackerCountPerCategory = useMemo(() => {
    const counts = {};
    trackers.forEach((t) => {
      if (t.categories && Array.isArray(t.categories)) {
        t.categories.forEach((c) => {
          counts[c.id] = (counts[c.id] || 0) + 1;
        });
      } else if (t.category?.id) {
        counts[t.category.id] = (counts[t.category.id] || 0) + 1;
      } else if (t.categoryId) {
        counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [trackers]);

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
    <AnimatePresence>
      {isCategorySidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeCategorySidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Slide-Over Panel */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="cat-sidebar z-[101]"
          >
            {/* Panel Header */}
            <div className="cat-sidebar-header">
              <div className="cat-sidebar-header-left">
                <div className="cat-sidebar-icon">
                  <FolderTree className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="cat-sidebar-title">Tracker Categories</h3>
                  <p className="cat-sidebar-subtitle">Filter trackers by category tree</p>
                </div>
              </div>

              <button onClick={closeCategorySidebar} className="cat-sidebar-close">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="cat-sidebar-search-wrap">
              <Search className="cat-sidebar-search-icon h-3.5 w-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter categories..."
                className="cat-sidebar-search-input"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="cat-sidebar-search-clear">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Active Filter Metadata */}
            <div className="cat-sidebar-meta">
              <span>
                {filteredCategories.length} categories available
              </span>
              {activeCategoryId && (
                <button
                  onClick={() => {
                    setFilters({ categoryId: null });
                  }}
                  className="cat-reset-btn"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Category Items List */}
            <div className="cat-sidebar-list custom-scrollbar">
              {/* All Trackers Pill */}
              <button
                onClick={() => {
                  setFilters({ categoryId: null });
                }}
                className={`cat-item ${activeCategoryId === null ? "active" : ""}`}
              >
                <div className="cat-item-left">
                  <span className="cat-item-all-dot">
                    <Activity className="h-3.5 w-3.5" />
                  </span>
                  <span className="cat-item-name">All Trackers</span>
                </div>
                <span className="cat-item-count">{trackers.length}</span>
              </button>

              {filteredCategories.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                const count = trackerCountPerCategory[cat.id] || cat.itemsCount || 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFilters({ categoryId: isActive ? null : cat.id });
                    }}
                    className={`cat-item ${isActive ? "active" : ""}`}
                  >
                    <div className="cat-item-left">
                      <span
                        className="cat-item-dot"
                        style={{ backgroundColor: cat.color || "#8b5cf6" }}
                      />
                      <span className="cat-item-name">{cat.name}</span>
                      {cat.isSystem && <span className="cat-sys-badge">SYS</span>}
                    </div>
                    <span className="cat-item-count">{count}</span>
                  </button>
                );
              })}

              {filteredCategories.length === 0 && (
                <div className="cat-empty">
                  <FolderTree className="h-8 w-8 text-[var(--text-muted)] opacity-40" />
                  <p>No matching categories found.</p>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="cat-sidebar-footer">
              <button
                onClick={() => {
                  closeCategorySidebar();
                  openCategoryDrawer(null);
                }}
                className="cat-create-btn"
              >
                <Plus className="h-4 w-4" /> Create Category Node
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
