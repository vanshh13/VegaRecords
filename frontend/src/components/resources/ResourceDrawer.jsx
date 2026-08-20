"use client";

import { useState, useEffect } from "react";
import { useResourceStore } from "@/stores/resource.store";
import { useCategoryStore } from "@/stores/category.store";
import { X, Save, Bookmark, Globe, Tag, FileText, Star, Youtube, Github, BookOpen, GraduationCap } from "lucide-react";

const RESOURCE_TYPES = [
  { value: "YOUTUBE", label: "YouTube" },
  { value: "GITHUB", label: "GitHub" },
  { value: "DOCUMENTATION", label: "Documentation" },
  { value: "ARTICLE", label: "Article" },
  { value: "BLOG", label: "Blog" },
  { value: "COURSE", label: "Course" },
  { value: "WEBSITE", label: "Website" },
  { value: "LINK", label: "General Link" },
  { value: "DOCUMENT", label: "Document" },
  { value: "BOOK", label: "Book" },
  { value: "OTHER", label: "Other" },
];

export default function ResourceDrawer() {
  const { drawerOpen, closeDrawer, editingResource, createResource, updateResource } =
    useResourceStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [resourceType, setResourceType] = useState("LINK");
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (editingResource) {
      setTitle(editingResource.title || "");
      setUrl(editingResource.url || "");
      setResourceType(editingResource.resourceType || "LINK");
      setNotes(editingResource.notes || "");
      setIsFavorite(Boolean(editingResource.isFavorite));
      setSelectedCategoryIds(
        editingResource.categories ? editingResource.categories.map((c) => c.id) : []
      );
    } else {
      setTitle("");
      setUrl("");
      setResourceType("LINK");
      setNotes("");
      setIsFavorite(false);
      setSelectedCategoryIds([]);
    }
  }, [editingResource, drawerOpen]);

  if (!drawerOpen) return null;

  const handleCategoryToggle = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        url: url.trim(),
        resourceType,
        notes: notes.trim(),
        isFavorite,
        categoryIds: selectedCategoryIds,
      };

      if (editingResource) {
        await updateResource(editingResource.id, payload);
      } else {
        await createResource(payload);
      }
      closeDrawer();
    } catch {
      // Handled in store
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-[var(--primary)]" />
              {editingResource ? "Edit Resource" : "Create New Resource"}
            </h2>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js 15 Documentation & App Router Guide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            {/* URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[var(--primary)]" /> URL Link *
              </label>
              <input
                type="url"
                required
                placeholder="https://nextjs.org/docs"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            {/* Resource Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Resource Type
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[var(--surface)] text-[var(--text)]">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Categories Multi-select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[var(--primary)]" /> Connect Categories
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] max-h-36 overflow-y-auto">
                {categories.map((c) => {
                  const isChecked = selectedCategoryIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCategoryToggle(c.id)}
                      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                        isChecked
                          ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: c.color || "#6366f1" }}
                      />
                      {c.name}
                    </button>
                  );
                })}

                {categories.length === 0 && (
                  <p className="text-[11px] text-[var(--text-muted)]">No categories available.</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[var(--primary)]" /> Notes & Key Takeaways
              </label>
              <textarea
                rows={4}
                placeholder="Add personal notes, summaries, or timestamps..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none"
              />
            </div>

            {/* Favorite toggle */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] cursor-pointer">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-0"
              />
              <Star className={`h-4 w-4 ${isFavorite ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"}`} />
              <span className="text-xs font-bold text-[var(--text)]">Mark as Favorite Bookmark</span>
            </label>
          </form>

          {/* Footer actions */}
          <div className="p-6 border-t border-[var(--border)] bg-[var(--card)] flex items-center gap-3">
            <button
              type="button"
              onClick={closeDrawer}
              className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !url.trim()}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {editingResource ? "Update" : "Save Bookmark"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
