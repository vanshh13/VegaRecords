"use client";

import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import TrackerTypeCard from "@/components/trackerTypes/TrackerTypeCard";
import TrackerTypeDrawer from "@/components/trackerTypes/TrackerTypeDrawer";
import FieldBuilderModal from "@/components/trackerTypes/FieldBuilderModal";
import { Layers, Plus, RefreshCw, Sparkles } from "lucide-react";

export default function TrackerTypesPage() {
  const { trackerTypes, isLoading, fetchTrackerTypes, openDrawer } = useTrackerTypeStore();

  useEffect(() => {
    fetchTrackerTypes();
  }, [fetchTrackerTypes]);

  return (
    <MainLayout>
      <div className="space-y-6 font-mono">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] flex items-center gap-2.5">
              <Layers className="h-6 w-6 text-[var(--primary)] animate-pulse" /> Tracker Type Management
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Notion database schemas & Airtable custom fields builder for your personal operating system.
            </p>
          </div>

          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" /> Create Tracker Type
          </button>
        </div>

        {/* Grid of Tracker Types */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-xs font-bold text-[var(--text-muted)] gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[var(--primary)]" /> Loading schema types...
          </div>
        ) : trackerTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 space-y-3">
            <Sparkles className="h-12 w-12 text-[var(--primary)] opacity-40 animate-pulse" />
            <h3 className="text-sm font-bold text-[var(--text)]">No Tracker Types Defined</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              Create custom tracker types (e.g. Movies, Books, Courses, Fitness) with custom fields.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trackerTypes.map((type) => (
              <TrackerTypeCard key={type.id} trackerType={type} />
            ))}
          </div>
        )}

        {/* Drawer & Modal */}
        <TrackerTypeDrawer />
        <FieldBuilderModal />
      </div>
    </MainLayout>
  );
}
