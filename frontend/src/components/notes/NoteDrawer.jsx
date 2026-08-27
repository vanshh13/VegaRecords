"use client";

import { useState, useEffect } from "react";
import { useNoteStore } from "@/stores/note.store";
import { useCategoryStore } from "@/stores/category.store";
import { X, Save, BookOpen, Tag, FileText, Star } from "lucide-react";

export default function NoteDrawer() {
  const { drawerOpen, closeDrawer, editingNote, createNote, updateNote } = useNoteStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || "");
      setContent(editingNote.content || "");
      setCategoryId(editingNote.categoryId || "");
      setIsFavorite(Boolean(editingNote.isFavorite));
    } else {
      setTitle("");
      setContent("");
      const activeCat = useNoteStore.getState().filters.categoryId;
      setCategoryId(activeCat || (categories.length > 0 ? categories[0].id : ""));
      setIsFavorite(false);
    }
  }, [editingNote, drawerOpen, categories]);


  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && drawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: content,
        categoryId: categoryId || null,
        isFavorite,
      };

      if (editingNote) {
        await updateNote(editingNote.id, payload);
      } else {
        await createNote(payload);
      }
      closeDrawer();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden font-mono">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-[101]">
        <div className="w-screen max-w-md bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--primary)]" />
              {editingNote ? "Edit Note" : "Create New Note"}
            </h2>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. System Design Architecture Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[var(--primary)]" /> Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              >
                <option value="" className="bg-[var(--surface)] text-[var(--text)]">
                  -- Select Category (Optional) --
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[var(--surface)] text-[var(--text)]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Initial Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[var(--primary)]" /> Content (Markdown)
              </label>
              <textarea
                rows={6}
                placeholder="Write your initial markdown notes..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none font-mono"
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
              <span className="text-xs font-bold text-[var(--text)]">Mark as Favorite Note</span>
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
              disabled={submitting || !title.trim()}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {editingNote ? "Update" : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
