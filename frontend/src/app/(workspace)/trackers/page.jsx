"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useTrackerStore } from "@/stores/tracker.store";
import TrackerHeader from "@/components/trackers/TrackerHeader";
import QuickContinueHub from "@/components/trackers/QuickContinueHub";
import TrackerCard from "@/components/trackers/TrackerCard";
import TrackerDrawer from "@/components/trackers/TrackerDrawer";
import TrackerInsightsWidgets from "@/components/trackers/TrackerInsightsWidgets";
import CreateTrackerWizardModal from "@/components/trackers/CreateTrackerWizardModal";
import TemplateMarketplaceModal from "@/components/trackers/TemplateMarketplaceModal";
import { Activity, RefreshCw, Wand2, LayoutTemplate, Sparkles } from "lucide-react";

export default function TrackersPage() {
  const { trackers, isLoading, fetchTrackers, viewMode } = useTrackerStore();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

  useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

  return (
    <MainLayout>
      <div className="space-y-6 font-mono pb-8">
        {/* Tracker System Header */}
        <TrackerHeader
          onOpenWizard={() => setIsWizardOpen(true)}
          onOpenMarketplace={() => setIsMarketplaceOpen(true)}
        />

        {/* Analytics & Category Insights Widgets */}
        <TrackerInsightsWidgets />

        {/* Gamified Quick Continue Hub */}
        <QuickContinueHub />

        {/* Tracker Workspace Grid Matrix */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[var(--primary)]" /> Trackers Library ({trackers.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-xs font-bold text-[var(--text-muted)] gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-[var(--primary)]" /> Loading tracker ecosystem...
            </div>
          ) : trackers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white shadow-xl">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--text)]">No Trackers Created Yet</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  Start tracking movies, weight loss, job applications, books, expenses or habits in seconds.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Wand2 className="h-4 w-4" /> 1-Click Smart Creation
                </button>
                <button
                  onClick={() => setIsMarketplaceOpen(true)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors flex items-center gap-2"
                >
                  <LayoutTemplate className="h-4 w-4 text-cyan-400" /> Browse Templates
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-5 ${
                viewMode === "library"
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                  : viewMode === "progress"
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {trackers.map((tracker) => (
                <TrackerCard key={tracker.id} tracker={tracker} />
              ))}
            </div>
          )}
        </div>

        {/* Standard Edit Drawer */}
        <TrackerDrawer />

        {/* 3-Step Guided Wizard Modal */}
        <CreateTrackerWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
        />

        {/* Public Templates Marketplace Modal */}
        <TemplateMarketplaceModal
          isOpen={isMarketplaceOpen}
          onClose={() => setIsMarketplaceOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
