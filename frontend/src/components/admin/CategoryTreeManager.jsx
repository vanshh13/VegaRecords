import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Shield,
  Tag,
  Save,
  X,
  CheckSquare,
  Square,
  Globe,
  User,
} from "lucide-react";
import { categoryApi } from "@/apis/category.api";

const PRESET_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#ec4899", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export default function CategoryTreeManager({ categories, onRefresh }) {
  const { user } = useAuthStore();
  const userRole = (typeof user?.role === "string" ? user.role : user?.role?.roleName)?.toUpperCase() || "";
  const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

  const [expandedNodes, setExpandedNodes] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "FolderTree",
    color: "#6366f1",
    parentCategoryId: "",
    isSystem: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpand = (id) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenCreate = (parentCatId = "") => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      icon: "FolderTree",
      color: "#6366f1",
      parentCategoryId: parentCatId || "",
      isSystem: true,
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (category) => {
    if (category.isSystem && !isAdmin) {
      alert("System categories cannot be modified by user role. Only admin can modify system categories.");
      return;
    }
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      icon: category.icon || "FolderTree",
      color: category.color || "#6366f1",
      parentCategoryId: category.parentCategoryId || category.parentId || "",
      isSystem: category.isSystem ?? false,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        parentCategoryId: formData.parentCategoryId || null,
        isSystem: formData.isSystem,
      };

      if (editingCategory) {
        await categoryApi.update(editingCategory.id, payload);
      } else {
        await categoryApi.create(payload);
      }
      setDrawerOpen(false);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSystemStatus = async (node) => {
    if (!isAdmin) {
      alert("Only system administrators can change System Category privilege.");
      return;
    }
    try {
      const payload = {
        name: node.name,
        description: node.description,
        icon: node.icon,
        color: node.color,
        parentCategoryId: node.parentCategoryId || node.parentId || null,
        isSystem: !node.isSystem,
      };
      await categoryApi.update(node.id, payload);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category system privilege.");
    }
  };

  const handleDelete = async (node) => {
    if (node.isSystem && !isAdmin) {
      alert("System category can't be removed by user role. Only admin can remove category with isSystem set to true.");
      return;
    }
    if (!confirm(`Are you sure you want to delete category "${node.name}"?`)) return;
    try {
      await categoryApi.delete(node.id);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category.");
    }
  };

  // Helper to extract parent ID
  const getParentId = (item) => item.parentCategoryId || item.parentId || null;

  // Build recursive tree
  const buildTree = (items, targetParentId = null) => {
    return items.filter((item) => getParentId(item) === targetParentId);
  };

  const displayCategories = categories;
  const rootCategories = buildTree(displayCategories, null);

  const renderNode = (node, depth = 0) => {
    const children = buildTree(displayCategories, node.id);
    const hasChildren = children.length > 0;
    const isExpanded = !!expandedNodes[node.id];

    return (
      <div key={node.id} className="space-y-1 font-mono">
        <div
          style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
          className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 hover:border-[var(--primary)]/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(node.id)}
                className="p-1 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <span className="w-6" />
            )}

            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-xs shadow-sm"
              style={{ backgroundColor: node.color || "#6366f1" }}
            >
              <Tag className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[var(--text)]">{node.name}</span>
                <button
                  type="button"
                  onClick={() => handleToggleSystemStatus(node)}
                  title="Click to toggle System Category status"
                  className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase border transition-transform hover:scale-105 cursor-pointer flex items-center gap-1 ${
                    node.isSystem
                      ? "bg-[var(--primary)]/15 border-[var(--primary)]/40 text-[var(--primary)]"
                      : "bg-amber-500/15 border-amber-500/40 text-amber-400"
                  }`}
                >
                  {node.isSystem ? <Globe className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                  {node.isSystem ? "SYSTEM CATEGORY" : "USER CATEGORY"}
                </button>
              </div>
              {node.description && (
                <p className="text-[10px] text-[var(--text-muted)] truncate max-w-md">
                  {node.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
            {/* Direct Toggle System Category Privilege Button */}
            <button
              onClick={() => handleToggleSystemStatus(node)}
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all ${
                node.isSystem
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  : "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20"
              }`}
              title={node.isSystem ? "Revoke System Privilege (Make User Category)" : "Assign as System Category"}
            >
              <Shield className="h-3 w-3" />
              {node.isSystem ? "Demote" : "Assign System"}
            </button>

            <button
              onClick={() => handleOpenCreate(node.id)}
              className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[10px] font-bold text-[var(--primary)] hover:border-[var(--primary)]/40 transition-all"
              title="Add Child Category"
            >
              <Plus className="h-3 w-3" /> Child
            </button>

            <button
              onClick={() => handleOpenEdit(node)}
              className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-all"
              title="Edit Category"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => handleDelete(node)}
              className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
              title={node.isSystem && !isAdmin ? "System category - Only admin can remove" : "Delete Category"}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1 border-l-2 border-[var(--border)] ml-6 pl-2">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-[var(--text)] flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--primary)]" /> System & Custom Category Manager
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Admins can assign any category as a global System Category or manage custom workspace categories.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreate("")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Create Category
        </button>
      </div>

      {/* Category Tree View */}
      {rootCategories.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center text-xs text-[var(--text-muted)]">
          No categories created yet. Click "Create Category" to add one.
        </div>
      ) : (
        <div className="space-y-2">{rootCategories.map((root) => renderNode(root, 0))}</div>
      )}

      {/* Drawer / Modal for Creation and Editing */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-extrabold text-[var(--text)] flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-[var(--primary)]" />
              {editingCategory ? "Edit Category" : "Create Category"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Education, Health, Sports..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              {/* System Category Privilege Checkbox */}
              <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-3.5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-[var(--primary)]" /> Assign as System Category
                  </span>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    System categories are globally visible across all user workspaces.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isSystem}
                  onChange={(e) => setFormData({ ...formData, isSystem: e.target.checked })}
                  className="h-4 w-4 rounded border-[var(--border)] bg-[var(--card)] text-[var(--primary)] focus:ring-[var(--primary)] accent-[var(--primary)] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5">Category Accent Color</label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`h-7 w-7 rounded-lg transition-transform ${
                        formData.color === c ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-80"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Parent Category Selection */}
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5">Parent Category (Optional)</label>
                <select
                  value={formData.parentCategoryId}
                  onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                >
                  <option value="" className="bg-[var(--surface)] text-[var(--text)]">None (Root Category)</option>
                  {displayCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id} className="bg-[var(--surface)] text-[var(--text)]">
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
