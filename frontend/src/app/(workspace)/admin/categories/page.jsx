"use client";

import { useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoryTreeManager from "@/components/admin/CategoryTreeManager";
import { useCategoryStore } from "@/stores/category.store";
import { FolderTree, RefreshCw } from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, fetchCategories, isLoading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <AdminLayout>
      <div className="space-y-6 font-mono">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] flex items-center gap-2.5">
            <FolderTree className="h-6 w-6 text-[var(--primary)]" /> System Category Management
          </h1>

          <button
            onClick={() => fetchCategories()}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh Categories
          </button>
        </div>


        {/* System Category Tree Manager Component */}
        <CategoryTreeManager categories={categories} onRefresh={fetchCategories} />
      </div>
    </AdminLayout>
  );
}
