"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { useTrackerStore } from "@/stores/tracker.store";
import TrackerHeader from "@/components/trackers/TrackerHeader";
import QuickContinueHub from "@/components/trackers/QuickContinueHub";
import TrackerDashboardWidgets from "@/components/trackers/TrackerDashboardWidgets";
import MediaTrackerCard from "@/components/trackers/media/MediaTrackerCard";
import LibraryPosterGrid from "@/components/trackers/media/LibraryPosterGrid";
import TrackerDrawer from "@/components/trackers/TrackerDrawer";
import CreateTrackerWizardModal from "@/components/trackers/CreateTrackerWizardModal";
import TrackerCategorySidebar from "@/components/trackers/TrackerCategorySidebar";
import { Activity, RefreshCw, Plus, Sparkles } from "lucide-react";

export default function TrackersPage() {
  const router = useRouter();
  const { trackers, isLoading, fetchTrackers, viewMode, openDrawer } = useTrackerStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

  return (
    <MainLayout>
      <div className="space-y-6 font-mono pb-8">
        {/* Tracker System Header */}
        <TrackerHeader
          onOpenWizard={() => setIsCreateModalOpen(true)}
        />

        {/* Real-time Dashboard Metric Widgets */}
        <TrackerDashboardWidgets />

        {/* Continue Watching / Continue Reading / Continue Playing Hub */}
        <QuickContinueHub />

        {/* Tracker Workspace Grid / Netflix-style Poster Library */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[var(--primary)]" /> Personal Life Tracking Vault ({trackers.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-xs font-bold text-[var(--text-muted)] gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-[var(--primary)]" /> Loading media tracker ecosystem...
            </div>
          ) : trackers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white shadow-xl">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--text)]">No Trackers Created Yet</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  Track Anime, Movies, TV Series, Books, Games, & Courses with real-time metadata autocomplete.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Create Tracker
                </button>
              </div>
            </div>
          ) : viewMode === "library" ? (
            <LibraryPosterGrid trackers={trackers} onSelect={(tracker) => router.push(`/trackers/${tracker.id}`)} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trackers.map((tracker) => (
                <MediaTrackerCard key={tracker.id} tracker={tracker} onSelect={(t) => router.push(`/trackers/${t.id}`)} />
              ))}
            </div>
          )}
        </div>

        {/* Slide-over Category Sidebar */}
        <TrackerCategorySidebar />

        {/* Standard Edit Drawer */}
        <TrackerDrawer />

        {/* Single Unified Create Tracker Modal */}
        <CreateTrackerWizardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
