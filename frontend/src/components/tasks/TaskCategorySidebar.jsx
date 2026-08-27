"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "@/stores/category.store";
import { useTaskStore } from "@/stores/task.store";

export default function TaskCategorySidebar() {
  const {
    categories,
    fetchCategories,
    openCreateDrawer: openCategoryDrawer,
  } = useCategoryStore();
  const {
    filters,
    setFilter,
    tasks,
    isCategorySidebarOpen,
    closeCategorySidebar,
  } = useTaskStore();

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

    // Use setTimeout so the initial trigger button click doesn't immediately fire click outside
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

  const taskCountPerCategory = useMemo(() => {
    const counts = {};
    tasks.forEach((t) => {
      if (t.categoryId) {
        counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

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
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="cat-sidebar z-[101]"
          >
            {/* Header */}
            <div className="cat-sidebar-header">
              <div className="cat-sidebar-header-left">
                <div className="cat-sidebar-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="cat-sidebar-title">Categories</h2>
                  <p className="cat-sidebar-subtitle">Filter by workspace category</p>
                </div>
              </div>
              <button
                onClick={closeCategorySidebar}
                className="cat-sidebar-close"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="cat-sidebar-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cat-sidebar-search-icon">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="cat-sidebar-search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="cat-sidebar-search-clear"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>

            {/* Meta row */}
            <div className="cat-sidebar-meta">
              <span>
                <strong className="cat-meta-count">
                  {searchTerm ? filteredCategories.length : categories.length}
                </strong>{" "}
                {searchTerm ? "matching" : "total"}
              </span>
              {activeCategoryId !== "ALL" && (
                <button
                  onClick={() => setFilter("categoryId", "ALL")}
                  className="cat-reset-btn"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Category list */}
            <div className="cat-sidebar-list">
              {/* All option */}
              <button
                onClick={() => setFilter("categoryId", "ALL")}
                className={`cat-item${activeCategoryId === "ALL" ? " active" : ""}`}
              >
                <div className="cat-item-left">
                  <div className="cat-item-all-dot">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <span className="cat-item-name">All Categories</span>
                </div>
                <span className="cat-item-count">{tasks.length}</span>
              </button>

              {/* Filtered list */}
              {filteredCategories.length === 0 ? (
                <div className="cat-empty">
                  <p>No categories match</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="cat-reset-btn"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                filteredCategories.map((cat) => {
                  const isActive = activeCategoryId === cat.id;
                  const count = taskCountPerCategory[cat.id] || 0;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilter("categoryId", cat.id)}
                      className={`cat-item${isActive ? " active" : ""}`}
                    >
                      <div className="cat-item-left">
                        <span
                          className="cat-item-dot"
                          style={{ backgroundColor: cat.color || "#8b5cf6" }}
                        />
                        <span className="cat-item-name">{cat.name}</span>
                        {cat.isSystem && (
                          <span className="cat-sys-badge">SYS</span>
                        )}
                      </div>
                      <span className="cat-item-count">{count}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="cat-sidebar-footer">
              <button
                onClick={() => {
                  closeCategorySidebar();
                  openCategoryDrawer(null);
                }}
                className="cat-create-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Create New Category</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
