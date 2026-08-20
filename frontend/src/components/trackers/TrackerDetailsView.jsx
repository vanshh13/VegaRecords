"use client";

import { useState } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import {
  ArrowLeft,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  Edit2,
  Trash2,
  Send,
  History,
} from "lucide-react";
import Link from "next/link";

export default function TrackerDetailsView({ tracker, values = [] }) {
  const { quickIncrementProgress, updateStatus, deleteTracker, openDrawer } = useTrackerStore();

  const [newValue, setNewValue] = useState("");
  const [loggingValue, setLoggingValue] = useState(false);

  if (!tracker) return null;

  const current = tracker.currentCount || 0;
  const target = tracker.targetCount || 100;
  const percent = Math.min(Math.round((current / target) * 100), 100);
  const typeName = tracker.trackerType?.name || "Series";

  const getUnitLabel = (name) => {
    if (name === "Series" || name === "Anime") return "Episode";
    if (name === "Book") return "Page";
    if (name === "Course") return "Module";
    return "Unit";
  };
  const unitLabel = getUnitLabel(typeName);

  const handleStatusChange = (e) => {
    updateStatus(tracker.id, e.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto font-mono space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/trackers"
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--primary)]" /> Back to Tracker Hub
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openDrawer(tracker)}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5 text-[var(--primary)]" /> Edit Tracker
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete tracker "${tracker.title}"?`)) deleteTracker(tracker.id);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Cover Poster */}
          {tracker.coverUrl ? (
            <img
              src={tracker.coverUrl}
              alt={tracker.title}
              className="h-48 w-36 rounded-2xl object-cover border border-[var(--border)] shadow-xl shrink-0"
            />
          ) : (
            <div className="h-48 w-36 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center text-[var(--primary)] shrink-0 shadow-inner">
              <Activity className="h-12 w-12 opacity-60 animate-pulse" />
            </div>
          )}

          {/* Title & Metadata */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-3 py-1 text-xs font-extrabold text-[var(--primary)] uppercase">
                {typeName}
              </span>

              {/* Status Select */}
              <select
                value={tracker.status || "IN_PROGRESS"}
                onChange={handleStatusChange}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-bold text-[var(--text)] focus:outline-none cursor-pointer"
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="PAUSED">Paused</option>
                <option value="DROPPED">Dropped</option>
                <option value="PLAN_TO_WATCH">Plan to Track</option>
              </select>

              {tracker.rating != null && (
                <span className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /> {tracker.rating} / 10
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text)] leading-tight">
              {tracker.title}
            </h1>

            {tracker.notes && (
              <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)]">
                {tracker.notes}
              </p>
            )}
          </div>
        </div>

        {/* Live Interactive Progress Section */}
        <div className="rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 p-6 space-y-4 shadow-inner">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[var(--text)] uppercase tracking-wider">
                Live Interactive Progress
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Current {unitLabel}: <span className="font-extrabold text-[var(--primary)]">{current}</span> of {target}
              </p>
            </div>
            <span className="text-xl sm:text-3xl font-extrabold text-[var(--primary)]">{percent}%</span>
          </div>

          <div className="h-3 w-full rounded-full bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => quickIncrementProgress(tracker, 1)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4" /> +1 {unitLabel}
            </button>
            <button
              onClick={() => quickIncrementProgress(tracker, 5)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
            >
              +5 {unitLabel}s
            </button>
          </div>
        </div>

        {/* Timeline Progress History Log */}
        <div className="space-y-4 pt-4 border-t border-[var(--border)]">
          <h3 className="text-sm font-extrabold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
            <History className="h-4 w-4 text-[var(--primary)]" /> Activity Timeline & Updates Log
          </h3>

          <div className="space-y-2">
            {values && values.length > 0 ? (
              values.map((v, i) => (
                <div
                  key={v.id || i}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs"
                >
                  <span className="font-bold text-[var(--text)]">{v.value}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {v.loggedAt ? new Date(v.loggedAt).toLocaleString() : "Just now"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] text-center">
                No custom progress history logged yet. Use +1 quick buttons above to record live progress updates!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
