"use client";

import { useState, useEffect } from "react";
import { useCategoryStore } from "@/stores/category.store";
import { ICON_MAP } from "./CategoryTreeExplorer";
import { X, Folder, Sparkles } from "lucide-react";

const COLOR_PRESETS = [
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
];

export default function CategoryDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    editingCategory,
    parentForNewChildId,
    categories,
    closeDrawer,
    addCategory,
    updateCategory,
  } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategoryId: null,
    icon: "Folder",
    color: "#6366f1",
  });

  useEffect(() => {
    if (drawerMode === "edit" && editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        parentCategoryId: editingCategory.parentCategoryId || editingCategory.parentId || null,
        icon: editingCategory.icon || "Folder",
        color: editingCategory.color || "#6366f1",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        parentCategoryId: parentForNewChildId || null,
        icon: "Folder",
        color: "#6366f1",
      });
    }
  }, [drawerMode, editingCategory, parentForNewChildId, isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (drawerMode === "edit" && editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await addCategory(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-[var(--surface)] border-l border-[var(--border)] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <h2 className="text-sm font-bold text-[var(--text)] font-mono uppercase tracking-wider flex items-center gap-2">
              <Folder className="h-4 w-4 text-[var(--primary)]" />
              {drawerMode === "edit" ? "Edit Category Node" : "New Category Node"}
            </h2>
            <button
              onClick={closeDrawer}
              className="rounded-lg p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form id="category-form" onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* Category Name */}
            <div>
              <label className="block mb-1 font-bold text-[var(--text)]">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Frontend Engineering"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            {/* Parent Category */}
            <div>
              <label className="block mb-1 font-bold text-[var(--text)]">Parent Node</label>
              <select
                value={formData.parentCategoryId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, parentCategoryId: e.target.value || null })
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              >
                <option value="">(None - Root Category)</option>
                {categories
                  .filter((c) => drawerMode !== "edit" || c.id !== editingCategory?.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block mb-1 font-bold text-[var(--text)]">Node Icon</label>
              <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-2 border border-[var(--border)] rounded-xl bg-[var(--card)]">
                {Object.keys(ICON_MAP).map((iconKey) => {
                  const IconComponent = ICON_MAP[iconKey];
                  const isSelected = formData.icon === iconKey;
                  return (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconKey })}
                      className={`flex h-10 items-center justify-center rounded-lg border transition-all ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/20 text-[var(--primary)] font-bold shadow"
                          : "border-transparent text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block mb-1 font-bold text-[var(--text)]">Theme Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-7 w-7 rounded-full transition-transform ${
                      formData.color === color ? "scale-125 ring-2 ring-white shadow-md" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-bold text-[var(--text)]">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of what this category manages..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Footer Submit Bar */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4 mt-6">
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-form"
            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-mono font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
          >
            {drawerMode === "edit" ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
