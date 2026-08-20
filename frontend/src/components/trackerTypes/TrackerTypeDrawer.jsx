"use client";

import { useState, useEffect } from "react";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import { X, Save, Layers, Palette, FileText } from "lucide-react";

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#6366f1", // indigo
];

export default function TrackerTypeDrawer() {
  const { drawerOpen, closeDrawer, editingType, createTrackerType, updateTrackerType } =
    useTrackerTypeStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingType) {
      setName(editingType.name || "");
      setDescription(editingType.description || "");
      setColor(editingType.color || "#3b82f6");
    } else {
      setName("");
      setDescription("");
      setColor("#3b82f6");
    }
  }, [editingType, drawerOpen]);

  if (!drawerOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        color,
      };

      if (editingType) {
        await updateTrackerType(editingType.id, payload);
      } else {
        await createTrackerType(payload);
      }
      closeDrawer();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6 overflow-y-auto custom-scrollbar pr-1">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-base font-extrabold text-[var(--text)]">
                  {editingType ? "Edit Tracker Type" : "Create Custom Tracker Type"}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form id="tracker-type-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                  Type Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Movie, Series, Anime, Book, Course..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of what this tracker type monitors..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase flex items-center gap-1">
                  <Palette className="h-3 w-3 text-[var(--primary)]" /> Theme Color Accent
                </label>
                <div className="flex items-center gap-2 mt-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-7 w-7 rounded-full transition-transform ${
                        color === c ? "scale-125 ring-2 ring-white shadow-md" : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="tracker-type-form"
              disabled={submitting || !name.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save Type
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
